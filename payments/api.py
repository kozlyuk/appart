from rest_framework.generics import ListAPIView
from rest_framework.serializers import ValidationError

from payments.serializers import BillSerializer
from payments.models import Bill


class BillListView(ListAPIView):
    """
    View all active bills of apartment.

    * Requires parameters: apartment.
    * Only apartment owner has permission to bills.
    """

    # queryset = Bill.objects.all()
    serializer_class = BillSerializer
    model = serializer_class.Meta.model
    paginate_by = 100

    def get_queryset(self):
        apartment = self.kwargs['apartment']
        queryset = self.model.objects.filter(apartment=apartment, is_active=True)
        if not queryset:
            raise ValidationError({"error": ["Apartment with such id does not exist."]})
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset.order_by('period')


class GetTotalDebt(ListAPIView):
    """
    View to list all users in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """

    # queryset = Bill.objects.all()
    serializer_class = BillSerializer
    model = serializer_class.Meta.model
    paginate_by = 100

    def get_queryset(self):
        apartment = self.kwargs['apartment']
        queryset = self.model.objects.filter(apartment=apartment)
        if not queryset:
            raise ValidationError({"error": ["Apartment with such id does not exist."]})
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset.order_by('period')
