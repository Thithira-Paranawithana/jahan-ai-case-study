from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None):
        """Create and return a regular user"""
        if not email:
            raise ValueError('Users must have an email address')
        if not full_name:
            raise ValueError('Users must have a full name')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            full_name=full_name
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, full_name, password=None):
        """Create and return a superuser"""
        user = self.create_user(
            email=email,
            full_name=full_name,
            password=password
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model with email as username"""
    
    # Required fields
    email = models.EmailField(unique=True, max_length=255)
    full_name = models.CharField(max_length=255)
    
    # Optional profile fields (for future use)
    country = models.CharField(max_length=100, null=True, blank=True)
    country_code = models.CharField(max_length=5, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('prefer_not_to_say', 'Prefer not to say')
        ],
        null=True,
        blank=True
    )
    
    # System fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email
