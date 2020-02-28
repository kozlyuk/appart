from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from payments.serializers import BillSerializer
from payments.models import Bill

class BillListView(ListAPIView):
    """
    View to list all users in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """

    queryset = Bill.objects.all()
    serializer_class = BillSerializer
