import datetime
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from crops.models import Crop
from .models import Market, MarketPrice
from .services import MarketPriceIntelligenceService, PriceForecastingService

class MarketIntelligenceServiceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.crop = Crop.objects.create(name='Tomato', crop_category=Crop.Category.VEGETABLES)
        self.market = Market.objects.create(
            name='Pimpalgaon APMC',
            district='Nashik',
            distance_km_default=24.0,
            market_fee_percent=1.05,
        )

        # Create 30 days of historical prices with a clear rising slope (18 -> 24)
        for i in range(30, -1, -1):
            p_date = datetime.date.today() - datetime.timedelta(days=i)
            modal = 18.0 + (30 - i) * 0.2 # 18.0 to 24.0
            MarketPrice.objects.create(
                crop=self.crop,
                market=self.market,
                date=p_date,
                modal_price=modal,
                min_price=modal - 1.0,
                max_price=modal + 1.0,
                arrival_volume=1200.0,
            )

    def test_get_historical_prices_timeframes(self):
        history_7d = MarketPriceIntelligenceService.get_historical_prices(self.crop, self.market, days=7)
        history_30d = MarketPriceIntelligenceService.get_historical_prices(self.crop, self.market, days=30)

        self.assertGreaterEqual(len(history_7d), 7)
        self.assertGreaterEqual(len(history_30d), 30)
        self.assertEqual(history_30d[-1]['modal_price'], 24.0)

    def test_calculate_trend_metrics_rising_trend(self):
        metrics = MarketPriceIntelligenceService.calculate_trend_metrics(self.crop, self.market, days=30)
        self.assertEqual(metrics['trend_direction'], 'rising')
        self.assertGreater(metrics['percentage_change'], 0)
        self.assertEqual(metrics['current_price'], 24.0)
        self.assertEqual(metrics['min_price'], 18.0)
        self.assertEqual(metrics['max_price'], 24.0)
        self.assertTrue(metrics['is_sufficient_data'])

    def test_prototype_price_forecast_calculation(self):
        forecast = PriceForecastingService.generate_prototype_forecast(self.crop, self.market, days_ahead=7)
        self.assertEqual(forecast['forecast_horizon_days'], 7)
        self.assertIn('peak_selling_day', forecast)
        self.assertGreaterEqual(forecast['forecast_confidence_score'], 80)
        self.assertTrue(forecast['is_reliable_data'])
        self.assertEqual(len(forecast['forecast_points']), 7)

        # Verify uncertainty bounds exist for each forecast point
        for pt in forecast['forecast_points']:
            self.assertIn('predicted_price', pt)
            self.assertIn('lower_estimate', pt)
            self.assertIn('upper_estimate', pt)
            self.assertLessEqual(pt['lower_estimate'], pt['predicted_price'])
            self.assertGreaterEqual(pt['upper_estimate'], pt['predicted_price'])

    def test_insufficient_data_fallback(self):
        new_crop = Crop.objects.create(name='Dragonfruit', crop_category=Crop.Category.FRUITS)
        metrics = MarketPriceIntelligenceService.calculate_trend_metrics(new_crop, days=30)
        self.assertFalse(metrics['is_sufficient_data'])
        self.assertEqual(metrics['trend_direction'], 'steady')

        forecast = PriceForecastingService.generate_prototype_forecast(new_crop, days_ahead=7)
        self.assertFalse(forecast['is_reliable_data'])
        self.assertLessEqual(forecast['forecast_confidence_score'], 60)

    def test_market_intelligence_api_endpoints(self):
        # 1. Price History Endpoint
        resp_hist = self.client.get(reverse('market-price-history') + f'?crop=Tomato&days=7')
        self.assertEqual(resp_hist.status_code, status.HTTP_200_OK)
        self.assertIn('prices', resp_hist.data)

        # 2. Price Trend Endpoint
        resp_trend = self.client.get(reverse('market-price-trend') + f'?crop=Tomato&days=30')
        self.assertEqual(resp_trend.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_trend.data['trend_direction'], 'rising')

        # 3. Price Forecast Endpoint
        resp_fc = self.client.get(reverse('market-price-forecast') + f'?crop=Tomato&days=7')
        self.assertEqual(resp_fc.status_code, status.HTTP_200_OK)
        self.assertIn('forecast_points', resp_fc.data)
