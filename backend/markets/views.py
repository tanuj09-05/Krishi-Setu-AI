from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Market, MarketPrice
from .serializers import MarketSerializer, MarketPriceSerializer
from .services import MarketPriceIntelligenceService, PriceForecastingService
from crops.models import Crop

class MarketListView(generics.ListCreateAPIView):
    queryset = Market.objects.filter(active=True)
    serializer_class = MarketSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['type', 'district', 'state']
    search_fields = ['name', 'district', 'location']


class MarketDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer
    permission_classes = [AllowAny]


class MarketPriceListView(generics.ListAPIView):
    serializer_class = MarketPriceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = MarketPrice.objects.select_related('market', 'crop').all()
        crop_name = self.request.query_params.get('crop')
        crop_id = self.request.query_params.get('crop_id')
        market_id = self.request.query_params.get('market_id')

        if crop_id:
            queryset = queryset.filter(crop_id=crop_id)
        elif crop_name:
            queryset = queryset.filter(crop__name__icontains=crop_name)

        if market_id:
            queryset = queryset.filter(market_id=market_id)

        return queryset


class MarketPriceHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        crop_name = request.query_params.get('crop', 'Tomato')
        market_id = request.query_params.get('market_id')
        try:
            days = max(1, min(int(request.query_params.get('days', 30)), 365))
        except (ValueError, TypeError):
            days = 30

        crop = Crop.objects.filter(name__icontains=crop_name).first() or Crop.objects.first()
        market = Market.objects.filter(id=market_id).first() if market_id else None

        if not crop:
            return Response({'error': 'Crop not found'}, status=status.HTTP_404_NOT_FOUND)

        history = MarketPriceIntelligenceService.get_historical_prices(
            crop=crop,
            market=market,
            days=days
        )
        return Response({
            'crop_id': crop.id,
            'crop_name': crop.name,
            'market_id': market.id if market else None,
            'market_name': market.name if market else 'Regional APMC Average',
            'timeframe_days': days,
            'count': len(history),
            'prices': history,
        }, status=status.HTTP_200_OK)


class MarketPriceTrendView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        crop_name = request.query_params.get('crop', 'Tomato')
        market_id = request.query_params.get('market_id')
        try:
            days = max(1, min(int(request.query_params.get('days', 30)), 365))
        except (ValueError, TypeError):
            days = 30

        crop = Crop.objects.filter(name__icontains=crop_name).first() or Crop.objects.first()
        market = Market.objects.filter(id=market_id).first() if market_id else None

        if not crop:
            return Response({'error': 'Crop not found'}, status=status.HTTP_404_NOT_FOUND)

        trend_data = MarketPriceIntelligenceService.calculate_trend_metrics(
            crop=crop,
            market=market,
            days=days
        )
        return Response(trend_data, status=status.HTTP_200_OK)


class MarketPriceForecastView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        crop_name = request.query_params.get('crop', 'Tomato')
        market_id = request.query_params.get('market_id')
        try:
            days_ahead = max(1, min(int(request.query_params.get('days', 7)), 30))
        except (ValueError, TypeError):
            days_ahead = 7

        crop = Crop.objects.filter(name__icontains=crop_name).first() or Crop.objects.first()
        market = Market.objects.filter(id=market_id).first() if market_id else None

        if not crop:
            return Response({'error': 'Crop not found'}, status=status.HTTP_404_NOT_FOUND)

        forecast_data = PriceForecastingService.generate_prototype_forecast(
            crop=crop,
            market=market,
            days_ahead=days_ahead
        )
        return Response(forecast_data, status=status.HTTP_200_OK)


class MarketCompareView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        crop_name = request.query_params.get('crop', 'Tomato')
        try:
            quantity_kg = float(request.query_params.get('quantity_kg', 500.0))
            if quantity_kg <= 0:
                quantity_kg = 500.0
        except (ValueError, TypeError):
            quantity_kg = 500.0

        crop = Crop.objects.filter(name__icontains=crop_name).first() or Crop.objects.first()

        latest_prices = MarketPrice.objects.filter(crop=crop).select_related('market').order_by('-date')

        seen_markets = set()
        comparison_list = []
        for p in latest_prices:
            if p.market_id in seen_markets:
                continue
            seen_markets.add(p.market_id)

            market = p.market
            dist = float(market.distance_km_default)

            # Transport estimation formula
            if dist <= 10:
                transport_per_kg = 0.50
            elif dist <= 30:
                transport_per_kg = 1.20
            elif dist <= 60:
                transport_per_kg = 1.80
            elif dist <= 250:
                transport_per_kg = 2.80
            else:
                transport_per_kg = round(4.00 * (dist / 1280.0), 2)

            gross_price = float(p.modal_price)
            mandi_fee = round(gross_price * (float(market.market_fee_percent) / 100.0), 2)
            handling = float(market.weighment_cost_per_kg + market.unloading_cost_per_kg)
            total_deductions = round(transport_per_kg + mandi_fee + handling, 2)
            net_realization = round(gross_price - total_deductions, 2)

            comparison_list.append({
                'destination_id': market.id,
                'destination_name': market.name,
                'destination_type': 'MANDI' if market.type == Market.MarketType.MANDI else 'BUYER',
                'district': market.district,
                'distance_km': dist,
                'gross_price_per_kg': gross_price,
                'transport_cost_per_kg': transport_per_kg,
                'storage_and_handling_per_kg': handling,
                'mandi_cess_and_fees_per_kg': mandi_fee,
                'total_deductions_per_kg': total_deductions,
                'net_realization_per_kg': net_realization,
                'total_gross_amount': round(gross_price * quantity_kg, 2),
                'total_net_payout': round(net_realization * quantity_kg, 2),
                'arrival_volume_quintals': float(p.arrival_volume),
                'arrival_trend': p.arrival_trend,
                'payment_cycle_days': market.payment_cycle_days,
                'reliability_score': market.reliability_score,
            })

        comparison_list.sort(key=lambda x: x['net_realization_per_kg'], reverse=True)
        if comparison_list:
            comparison_list[0]['is_top_recommendation'] = True

        return Response({
            'crop': crop.name if crop else crop_name,
            'quantity_kg': quantity_kg,
            'comparisons': comparison_list,
        }, status=status.HTTP_200_OK)
