from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates a demo user for testing: john@example.com / Password@123'

    def handle(self, *args, **kwargs):
        email = 'john@example.com'
        full_name = 'John Doe'
        password = 'Password@123'
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'Demo user already exists: {email}'))
            return
        
        user = User.objects.create_user(
            email=email,
            full_name=full_name,
            password=password
        )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created demo user: {email}'))
        self.stdout.write(self.style.SUCCESS(f'Password: {password}'))
