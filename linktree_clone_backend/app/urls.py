from django.urls import path
from app.views import GroupLinksAPIView, UserLinkGroupAPIView

urlpatterns = [
   path('group/<int:group_id>/links/', GroupLinksAPIView.as_view(), name='group-link'),
   path('user/linkgroups/', UserLinkGroupAPIView.as_view(), name='user-linkgroups'),
   path('user/linkgroups/create/', UserLinkGroupAPIView.as_view(), name='user-linkgroups-create'),
   path('user/linkgroups/<int:linkgroup_id>/', UserLinkGroupAPIView.as_view(), name='user-linkgroups-detail'),

]
