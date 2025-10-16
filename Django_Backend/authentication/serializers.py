from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8
    )
    
    class Meta:
        model = User
        fields = ('email', 'full_name', 'password')
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()
    
    def validate_full_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters long.")
        return value.strip()
    
    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = (
            'id', 
            'email', 
            'full_name', 
            'country', 
            'country_code', 
            'phone', 
            'date_of_birth', 
            'gender', 
            'date_joined'
        )
        read_only_fields = ('id', 'email', 'date_joined')


class UserUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('full_name', 'country', 'country_code', 'phone', 'date_of_birth', 'gender')
    
    def validate_full_name(self, value):
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters long.")
        return value.strip() if value else value
    
    def validate_phone(self, value):
        if value:
            # Remove spaces and dashes for validation
            cleaned = value.replace(' ', '').replace('-', '')
            if not cleaned.isdigit():
                raise serializers.ValidationError("Phone number must contain only digits, spaces, or dashes.")
            if len(cleaned) < 7 or len(cleaned) > 15:
                raise serializers.ValidationError("Phone number must be between 7 and 15 digits.")
        return value
    
    def validate_country_code(self, value):
        if value:
            if not value.startswith('+'):
                raise serializers.ValidationError("Country code must start with '+'")
            cleaned = value[1:]  # Remove +
            if not cleaned.isdigit():
                raise serializers.ValidationError("Country code must be in format '+1' or '+91'")
            if len(cleaned) < 1 or len(cleaned) > 4:
                raise serializers.ValidationError("Country code must be between 1 and 4 digits.")
        return value
    
    def validate_date_of_birth(self, value):
        if value:
            from datetime import date
            today = date.today()
            age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
            
            if value > today:
                raise serializers.ValidationError("Date of birth cannot be in the future.")
            if age < 13:
                raise serializers.ValidationError("You must be at least 13 years old.")
            if age > 120:
                raise serializers.ValidationError("Please enter a valid date of birth.")
        return value
    
    def validate_gender(self, value):
        valid_choices = ['male', 'female', 'prefer_not_to_say']
        if value and value not in valid_choices:
            raise serializers.ValidationError(f"Gender must be one of: {', '.join(valid_choices)}")
        return value
    
    def validate(self, data):
       
        # Get existing values from instance if doing partial update
        phone = data.get('phone', self.instance.phone if self.instance else None)
        country_code = data.get('country_code', self.instance.country_code if self.instance else None)
        
        # Both must be provided together or both must be null
        if (phone and not country_code) or (country_code and not phone):
            raise serializers.ValidationError({
                'phone': 'Phone number and country code must be provided together.',
                'country_code': 'Phone number and country code must be provided together.'
            })
        
        return data
