from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)

from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# Create your models here.
class EmailUserManager(BaseUserManager):
    
    def _create_user(self,email, password, is_staff,is_superuser,**extra_fields):

        now = timezone.now()

        if not email:
            raise ValueError('You must provide an email address')
        is_active = extra_fields.pop('is_active', True)
        user = self.model(
            email=email,
            is_staff=is_staff,
            is_active=is_active,
            is_superuser=is_superuser,
            last_login=now,
            date_joined=now,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_staff', False)
        return self._create_user(email, password, **extra_fields)
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff as True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser as True')
        
        return self._create_user(email, password, **extra_fields)
    
class AbstractEmailUser(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(
    _("email address"), max_length=255, unique=True,db_index=True
    )

    is_staff = models.BooleanField(
        _("staff status"), default=False
    )

    is_active = models.BooleanField(
        _("active"), default=True
    )

    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = EmailUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        abstract = True

    def get_full_name(self):
        return self.email
    
    def get_short_name(self):
        return self.email


class EmailUser(AbstractEmailUser):
    class Meta(AbstractEmailUser.Meta):
        swappable='AUTH_USER_MODEL'

    