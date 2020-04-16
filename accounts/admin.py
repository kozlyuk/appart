from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.forms import CustomUserCreationForm, CustomUserChangeForm
from accounts.models import User


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ('mobile_number', 'email', 'is_staff', 'is_active',)
    list_filter = ('mobile_number', 'email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('first_name', 'last_name', 'email', 'birth_date', 'avatar')}),
        ('Permissions', {'fields': ('groups', 'is_staff', 'is_active', 'is_registered')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('mobile_number', 'password1', 'password2')
        }),
    )
    search_fields = ('mobile_number', 'email',)
    ordering = ('last_name', 'first_name',)


admin.site.register(User, CustomUserAdmin)
