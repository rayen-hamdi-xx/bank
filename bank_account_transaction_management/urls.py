from django.urls import path
from . import views

urlpatterns = [
    path('management/', views.bank_soap_app, name='soap_service'),  
]
