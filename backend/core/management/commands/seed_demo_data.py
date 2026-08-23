import datetime
import math
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import User
from farmers.models import FarmerProfile, FarmerCrop
from crops.models import Crop
from markets.models import Market, MarketPrice
from buyers.models import Buyer, BuyerDemand
from lots.models import DigitalLot, LotImage, Offer
from logistics.models import TransportVehicle, Logistics
from transactions.models import Transaction
from recommendations.services import RecommendationService

class Command(BaseCommand):
    help = 'Seed realistic demo data for KrishiSetu AI (SIH Problem Statement 26132)'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Clearing old demo data..."))
        Transaction.objects.all().delete()
        Logistics.objects.all().delete()
        Offer.objects.all().delete()
        DigitalLot.objects.all().delete()
        BuyerDemand.objects.all().delete()
        Buyer.objects.all().delete()
        MarketPrice.objects.all().delete()
        Market.objects.all().delete()
        FarmerCrop.objects.all().delete()
        FarmerProfile.objects.all().delete()
        Crop.objects.all().delete()
        TransportVehicle.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        self.stdout.write(self.style.SUCCESS("Seeding Crops..."))
        crops_data = [
            {'name': 'Tomato', 'local_name': 'टमाटर (Tamatar)', 'crop_category': Crop.Category.VEGETABLES, 'icon': '🍅', 'default_shelf_life_days': 5},
            {'name': 'Onion (Nashik Red)', 'local_name': 'कांदा (Pyaaz)', 'crop_category': Crop.Category.VEGETABLES, 'icon': '🧅', 'default_shelf_life_days': 30},
            {'name': 'Soybean (JS 335)', 'local_name': 'सोयाबीन (Soyabean)', 'crop_category': Crop.Category.OILSEEDS, 'icon': '🌱', 'default_shelf_life_days': 180},
            {'name': 'Table Grapes (Thomson)', 'local_name': 'द्राक्षे (Angoor)', 'crop_category': Crop.Category.FRUITS, 'icon': '🍇', 'default_shelf_life_days': 10},
            {'name': 'Sharbati Wheat', 'local_name': 'गहू (Gehun)', 'crop_category': Crop.Category.GRAINS, 'icon': '🌾', 'default_shelf_life_days': 365},
        ]
        crops = {}
        for c in crops_data:
            crop_obj, _ = Crop.objects.get_or_create(name=c['name'], defaults=c)
            crops[c['name']] = crop_obj

        self.stdout.write(self.style.SUCCESS("Seeding Users & Demo Accounts..."))
        # 1. Demo Farmer Account
        farmer_user, _ = User.objects.get_or_create(
            phone_number='9823012345',
            defaults={
                'name': 'Rameshwar Patil',
                'email': 'farmer@demo.krishisetu',
                'role': User.Role.FARMER,
                'location': 'Dindori, Nashik, Maharashtra',
                'preferred_language': User.Language.ENGLISH,
            }
        )
        farmer_user.set_password('Demo@123')
        farmer_user.save()

        # 2. Demo Buyer Account
        buyer_user, _ = User.objects.get_or_create(
            phone_number='9823098765',
            defaults={
                'name': 'Aniket Deshmukh',
                'email': 'buyer@demo.krishisetu',
                'role': User.Role.BUYER,
                'location': 'Ozar Hub, Nashik',
                'preferred_language': User.Language.ENGLISH,
            }
        )
        buyer_user.set_password('Demo@123')
        buyer_user.save()

        # 3. Demo FPO Account
        fpo_user, _ = User.objects.get_or_create(
            phone_number='9823055555',
            defaults={
                'name': 'Sahyadri Agro FPO',
                'email': 'fpo@demo.krishisetu',
                'role': User.Role.FPO,
                'location': 'Nashik, Maharashtra',
                'preferred_language': User.Language.ENGLISH,
            }
        )
        fpo_user.set_password('Demo@123')
        fpo_user.save()

        # 4. Demo Admin Account
        admin_user, _ = User.objects.get_or_create(
            phone_number='9823000000',
            defaults={
                'name': 'System Administrator',
                'email': 'admin@demo.krishisetu',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'location': 'Mumbai, Maharashtra',
                'preferred_language': User.Language.ENGLISH,
            }
        )
        admin_user.set_password('Demo@123')
        admin_user.save()

        farmer_profile, _ = FarmerProfile.objects.get_or_create(
            user=farmer_user,
            defaults={
                'farm_location': 'Gat No. 44, Dindori Shivar',
                'village': 'Dindori',
                'taluka': 'Dindori',
                'district': 'Nashik',
                'state': 'Maharashtra',
                'farm_size_acres': 4.5,
                'organization_fpo': 'Sahyadri Farmers Producer Co. Ltd.',
                'fpo_member_id': 'SF-2024-8842',
                'trust_score': 94,
                'rating': 4.9,
                'completed_transactions': 18,
                'bank_account_linked': True,
                'verification_status': FarmerProfile.VerificationStatus.VERIFIED,
            }
        )

        # Farmer Harvests
        FarmerCrop.objects.get_or_create(
            farmer=farmer_profile,
            crop=crops['Tomato'],
            defaults={
                'variety': 'Abhinav Hybrid Red',
                'quantity': 500.0,
                'available_quantity': 500.0,
                'harvest_date': datetime.date.today(),
                'expected_price': 24.0,
                'quality_grade': FarmerCrop.QualityGrade.GRADE_A,
                'location': 'Farm Gate, Dindori',
                'moisture_percentage': 12.0,
            }
        )

        self.stdout.write(self.style.SUCCESS("Seeding Markets & Historical Prices..."))
        markets_data = [
            {
                'name': 'Dindori Local Sub-Mandi',
                'type': Market.MarketType.MANDI,
                'location': 'Dindori Sub-Market Yard',
                'district': 'Nashik',
                'distance_km_default': 8.0,
                'market_fee_percent': 1.0,
                'weighment_cost_per_kg': 0.10,
                'unloading_cost_per_kg': 0.15,
                'reliability_score': 82,
                'payment_cycle_days': 2,
                'prices': [
                    {'crop': crops['Tomato'], 'modal': 21.0, 'min': 20.0, 'max': 22.0, 'volume': 420.0, 'trend': 'steady'},
                    {'crop': crops['Onion (Nashik Red)'], 'modal': 27.5, 'min': 25.0, 'max': 29.0, 'volume': 1200.0, 'trend': 'rising'},
                ]
            },
            {
                'name': 'Pimpalgaon Baswant APMC (Market B)',
                'type': Market.MarketType.MANDI,
                'location': 'Pimpalgaon Yard, NH-3',
                'district': 'Nashik',
                'distance_km_default': 24.0,
                'market_fee_percent': 1.05,
                'weighment_cost_per_kg': 0.10,
                'unloading_cost_per_kg': 0.15,
                'reliability_score': 91,
                'payment_cycle_days': 1,
                'prices': [
                    {'crop': crops['Tomato'], 'modal': 23.0, 'min': 21.5, 'max': 24.0, 'volume': 1850.0, 'trend': 'rising'},
                    {'crop': crops['Onion (Nashik Red)'], 'modal': 28.5, 'min': 26.0, 'max': 30.5, 'volume': 4500.0, 'trend': 'steady'},
                ]
            },
            {
                'name': 'Nashik Main APMC Yard',
                'type': Market.MarketType.MANDI,
                'location': 'Panchavati Yard, Nashik City',
                'district': 'Nashik',
                'distance_km_default': 32.0,
                'market_fee_percent': 1.10,
                'weighment_cost_per_kg': 0.10,
                'unloading_cost_per_kg': 0.15,
                'reliability_score': 88,
                'payment_cycle_days': 2,
                'prices': [
                    {'crop': crops['Tomato'], 'modal': 23.5, 'min': 22.0, 'max': 24.5, 'volume': 3400.0, 'trend': 'rising'},
                    {'crop': crops['Soybean (JS 335)'], 'modal': 46.5, 'min': 44.0, 'max': 48.0, 'volume': 2100.0, 'trend': 'steady'},
                ]
            },
            {
                'name': 'Azadpur APMC Delhi (Market C)',
                'type': Market.MarketType.MANDI,
                'location': 'Azadpur Mandi Complex, North Delhi',
                'district': 'North Delhi',
                'state': 'Delhi',
                'distance_km_default': 1280.0,
                'market_fee_percent': 1.50,
                'weighment_cost_per_kg': 0.15,
                'unloading_cost_per_kg': 0.25,
                'reliability_score': 79,
                'payment_cycle_days': 5,
                'prices': [
                    {'crop': crops['Tomato'], 'modal': 26.0, 'min': 24.0, 'max': 27.5, 'volume': 14500.0, 'trend': 'dropping'},
                    {'crop': crops['Onion (Nashik Red)'], 'modal': 34.0, 'min': 31.0, 'max': 36.5, 'volume': 28000.0, 'trend': 'rising'},
                ]
            }
        ]

        for m_data in markets_data:
            prices_list = m_data.pop('prices')
            market_obj, _ = Market.objects.get_or_create(name=m_data['name'], defaults=m_data)

            for p in prices_list:
                base_modal = p['modal']
                for days_ago in range(90, -1, -1):
                    p_date = datetime.date.today() - datetime.timedelta(days=days_ago)
                    # Realistic wave + upward seasonal slope over 90 days
                    seasonal_trend = (90 - days_ago) * 0.035
                    cyclic_wave = 0.8 * math.sin(days_ago / 5.0)
                    day_modal = round(base_modal - (days_ago * 0.03) + cyclic_wave, 2)
                    day_min = round(day_modal - 1.2, 2)
                    day_max = round(day_modal + 1.5, 2)
                    day_volume = round(p['volume'] + (days_ago * 5.0) + (100.0 * math.cos(days_ago / 4.0)), 1)

                    trend_str = 'rising' if cyclic_wave > 0 else 'dropping' if cyclic_wave < -0.3 else 'steady'

                    MarketPrice.objects.get_or_create(
                        market=market_obj,
                        crop=p['crop'],
                        date=p_date,
                        defaults={
                            'modal_price': max(5.0, day_modal),
                            'min_price': max(4.0, day_min),
                            'max_price': max(6.0, day_max),
                            'arrival_volume': max(50.0, day_volume),
                            'arrival_trend': trend_str,
                        }
                    )

        self.stdout.write(self.style.SUCCESS("Seeding 5 Verified Institutional Buyers & Demand..."))
        buyers_data = [
            {
                'phone': '9422211099',
                'name': 'Sanjay Deshmukh',
                'business_name': 'Reliance Retail Sourcing Hub (Buyer A)',
                'buyer_type': Buyer.BuyerType.RETAILER,
                'procurement_hub': 'Nashik Collection Centre, Ozar',
                'location': 'Ozar, Nashik',
                'district': 'Nashik',
                'distance_km_default': 28.0,
                'payment_reliability_score': 99.2,
                'rating': 4.9,
                'reviews_count': 342,
                'payment_terms': 'Instant Digital (T+0)',
                'pickup_service_available': True,
                'crop_demands': [
                    {'crop': crops['Tomato'], 'qty': 5000.0, 'price': 24.0, 'quality': 'Grade A (Export/Premium)'}
                ]
            },
            {
                'phone': '9890122334',
                'name': 'Pravin Joshi',
                'business_name': 'BigBasket Fresh Farm Direct',
                'buyer_type': Buyer.BuyerType.RETAILER,
                'procurement_hub': 'Vinchur Cold Supply Center',
                'location': 'Vinchur, Nashik',
                'district': 'Nashik',
                'distance_km_default': 38.0,
                'payment_reliability_score': 98.5,
                'rating': 4.8,
                'reviews_count': 215,
                'payment_terms': 'Next Day (T+1)',
                'pickup_service_available': True,
                'crop_demands': [
                    {'crop': crops['Tomato'], 'qty': 3500.0, 'price': 23.8, 'quality': 'Grade B (Supermarket/Standard)'}
                ]
            },
            {
                'phone': '9763188776',
                'name': 'Mahesh Khairnar',
                'business_name': 'Kissan Agro Processing Ltd',
                'buyer_type': Buyer.BuyerType.PROCESSOR,
                'procurement_hub': 'MIDC Ambad Processing Unit',
                'location': 'Ambad, Nashik',
                'district': 'Nashik',
                'distance_km_default': 35.0,
                'payment_reliability_score': 96.0,
                'rating': 4.7,
                'reviews_count': 180,
                'payment_terms': 'Within 3 Days (T+3)',
                'pickup_service_available': False,
                'crop_demands': [
                    {'crop': crops['Tomato'], 'qty': 12000.0, 'price': 22.0, 'quality': 'Grade C (Processing/Bulk)'}
                ]
            },
            {
                'phone': '9822044556',
                'name': 'Vilas Shinde',
                'business_name': 'Sahyadri FPC Export Division',
                'buyer_type': Buyer.BuyerType.FPO_AGGREGATOR,
                'procurement_hub': 'Mohadi Packhouse',
                'location': 'Mohadi, Nashik',
                'district': 'Nashik',
                'distance_km_default': 18.0,
                'payment_reliability_score': 99.8,
                'rating': 4.95,
                'reviews_count': 512,
                'payment_terms': 'Next Day (T+1)',
                'pickup_service_available': True,
                'crop_demands': [
                    {'crop': crops['Table Grapes (Thomson)'], 'qty': 8000.0, 'price': 72.0, 'quality': 'Grade A (Export/Premium)'}
                ]
            },
            {
                'phone': '9881177665',
                'name': 'Anand Kulkarni',
                'business_name': 'ITC Agri Business Hub',
                'buyer_type': Buyer.BuyerType.WHOLESALER,
                'procurement_hub': 'Lasalgaon ITC Choupal',
                'location': 'Lasalgaon, Nashik',
                'district': 'Nashik',
                'distance_km_default': 42.0,
                'payment_reliability_score': 99.0,
                'rating': 4.85,
                'reviews_count': 290,
                'payment_terms': 'Instant Digital (T+0)',
                'pickup_service_available': True,
                'crop_demands': [
                    {'crop': crops['Onion (Nashik Red)'], 'qty': 15000.0, 'price': 29.5, 'quality': 'Grade B (Supermarket/Standard)'}
                ]
            }
        ]

        buyers = {}
        for idx, b_data in enumerate(buyers_data):
            demands_list = b_data.pop('crop_demands')
            b_phone = b_data.pop('phone')
            b_name = b_data.pop('name')

            if idx == 0:
                b_user = buyer_user
                b_phone = buyer_user.phone_number
                b_name = buyer_user.name
            else:
                b_user, _ = User.objects.get_or_create(
                    phone_number=b_phone,
                    defaults={
                        'name': b_name,
                        'role': User.Role.BUYER,
                        'location': b_data['location'],
                    }
                )
                b_user.set_password('Demo@123')
                b_user.save()

            buyer_obj, _ = Buyer.objects.get_or_create(
                user=b_user,
                defaults={
                    'contact_person': b_name,
                    'contact_phone': b_phone,
                    **b_data
                }
            )
            buyers[buyer_obj.business_name] = buyer_obj

            for dem in demands_list:
                BuyerDemand.objects.get_or_create(
                    buyer=buyer_obj,
                    crop=dem['crop'],
                    defaults={
                        'required_quantity': dem['qty'],
                        'remaining_quantity': dem['qty'],
                        'offered_price': dem['price'],
                        'minimum_quality': dem['quality'],
                        'delivery_location': buyer_obj.procurement_hub,
                    }
                )

        self.stdout.write(self.style.SUCCESS("Seeding Digital Lots & Offers..."))
        # Lot 1: Tomato 500kg
        tomato_lot, _ = DigitalLot.objects.get_or_create(
            lot_number='LOT-TOM-8921',
            defaults={
                'farmer': farmer_profile,
                'crop': crops['Tomato'],
                'variety': 'Abhinav (Hybrid Red)',
                'quantity': 500.0,
                'quality_grade': DigitalLot.QualityGrade.GRADE_A,
                'harvest_date': datetime.date.today() - datetime.timedelta(days=1),
                'asking_price': 24.0,
                'location': 'Farm Gate, Dindori (Nashik)',
                'moisture_percentage': 12.0,
                'description': 'Uniform sized red tomatoes, hand-picked and crated. Ready for gate pickup.',
                'status': DigitalLot.LotStatus.OFFER_RECEIVED,
            }
        )
        LotImage.objects.get_or_create(
            lot=tomato_lot,
            image_url='https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
            is_primary=True,
            caption='Fresh harvest sample'
        )

        # Offer from Buyer A on Tomato lot
        buyer_a = buyers['Reliance Retail Sourcing Hub (Buyer A)']
        Offer.objects.get_or_create(
            lot=tomato_lot,
            buyer=buyer_a,
            defaults={
                'offered_price': 24.0,
                'quantity': 500.0,
                'estimated_transport_per_kg': 1.5,
                'estimated_net_realization_per_kg': 22.5,
                'payment_terms': 'Instant Digital (T+0)',
                'pickup_offered': True,
                'message': 'Ready for gate pickup tomorrow 9 AM. Quality check at farm gate.',
                'status': Offer.OfferStatus.PENDING,
            }
        )

        # Offer from BigBasket
        buyer_bb = buyers['BigBasket Fresh Farm Direct']
        Offer.objects.get_or_create(
            lot=tomato_lot,
            buyer=buyer_bb,
            defaults={
                'offered_price': 23.5,
                'quantity': 500.0,
                'estimated_transport_per_kg': 1.6,
                'estimated_net_realization_per_kg': 21.9,
                'payment_terms': 'Next Day (T+1)',
                'pickup_offered': True,
                'message': 'Can arrange Tata Ace pickup from your farm.',
                'status': Offer.OfferStatus.PENDING,
            }
        )

        # Lot 2: Onion 2500kg
        DigitalLot.objects.get_or_create(
            lot_number='LOT-ONI-7714',
            defaults={
                'farmer': farmer_profile,
                'crop': crops['Onion (Nashik Red)'],
                'variety': 'Garwa / Gavran Red',
                'quantity': 2500.0,
                'quality_grade': DigitalLot.QualityGrade.GRADE_B,
                'harvest_date': datetime.date.today() - datetime.timedelta(days=7),
                'asking_price': 30.0,
                'location': 'Farm Godown, Dindori',
                'description': 'Properly cured summer onions with dried neck.',
                'status': DigitalLot.LotStatus.PUBLISHED,
            }
        )

        # Lot 3: Soybean 1200kg (Settled Deal)
        soy_lot, _ = DigitalLot.objects.get_or_create(
            lot_number='LOT-SOY-6401',
            defaults={
                'farmer': farmer_profile,
                'crop': crops['Soybean (JS 335)'],
                'variety': 'Certified Grade 1',
                'quantity': 1200.0,
                'quality_grade': DigitalLot.QualityGrade.GRADE_A,
                'harvest_date': datetime.date.today() - datetime.timedelta(days=12),
                'asking_price': 47.0,
                'location': 'Farm Gate, Dindori',
                'status': DigitalLot.LotStatus.SOLD,
            }
        )

        self.stdout.write(self.style.SUCCESS("Seeding Logistics Fleet & Booking..."))
        vehicles_data = [
            {'vehicle_type': 'Tata Ace (Chhota Hathi)', 'capacity_kg': 750, 'base_rate_per_km': 14.0, 'loading_unloading_cost': 350.0, 'driver_rating': 4.85, 'availability': 'Available Immediately'},
            {'vehicle_type': 'Mahindra Bolero Maxi Truck Plus', 'capacity_kg': 1500, 'base_rate_per_km': 18.0, 'loading_unloading_cost': 500.0, 'driver_rating': 4.90, 'availability': 'Available in 2h'},
            {'vehicle_type': 'Eicher Pro 14ft Open Truck', 'capacity_kg': 4000, 'base_rate_per_km': 26.0, 'loading_unloading_cost': 900.0, 'driver_rating': 4.75, 'availability': 'Scheduled Tomorrow'},
        ]
        for v in vehicles_data:
            TransportVehicle.objects.get_or_create(vehicle_type=v['vehicle_type'], defaults=v)

        Logistics.objects.get_or_create(
            tracking_number='KS-LOG-9021',
            defaults={
                'lot': tomato_lot,
                'pickup_location': 'Gat No. 44, Dindori Shivar, Nashik',
                'destination': 'Reliance Retail Sourcing Hub (Buyer A)',
                'distance_km': 28.0,
                'quantity_kg': 500.0,
                'vehicle_type': 'Tata Ace (MH-15-EG-4412)',
                'driver_name': 'Kishor Gaikwad',
                'driver_phone': '+91 97654 32109',
                'vehicle_number': 'MH-15-EG-4412',
                'estimated_transport_cost': 750.0,
                'cost_per_kg': 1.50,
                'status': Logistics.Status.DRIVER_ASSIGNED,
            }
        )

        self.stdout.write(self.style.SUCCESS("Seeding Completed Transactions..."))
        sahyadri_buyer = buyers['Sahyadri FPC Export Division']
        from django.utils import timezone
        Transaction.objects.get_or_create(
            lot=soy_lot,
            buyer=sahyadri_buyer,
            farmer=farmer_profile,
            defaults={
                'agreed_price': 46.50,
                'quantity': 1200.0,
                'transport_cost': 1400.0,
                'storage_cost': 0.0,
                'other_cost': 280.0,
                'gross_amount': 55800.0,
                'net_realization': 54120.0,
                'payment_status': Transaction.PaymentStatus.COMPLETED,
                'transaction_status': Transaction.TransactionStatus.SETTLED,
                'utr_number': 'SBIN20260815998241',
                'completed_at': timezone.now(),
            }
        )

        self.stdout.write(self.style.SUCCESS("Running Recommendation Engine for Demo Farmer..."))
        rec = RecommendationService.generate_recommendation(
            farmer=farmer_profile,
            crop=crops['Tomato'],
            quantity_kg=500.0,
        )
        self.stdout.write(self.style.SUCCESS(f"Generated AI Recommendation #{rec.id}: {rec.recommended_destination_name} (Net Rs.{rec.estimated_net_realization_per_kg}/kg)"))

        self.stdout.write(self.style.SUCCESS("KrishiSetu AI demo data seeded successfully!"))
