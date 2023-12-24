import random
import string
import sys

from django.shortcuts import render
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


from .models import Link, LinkGroup
from .serializers import LinkSerializer, LinkGroupSerializer

class GroupLinksAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, group_id):

        try:
            user_id = request.user.id
            link_group = LinkGroup.objects.get(id = group_id, group_creator__id = user_id)
            link_group_serializer = LinkGroupSerializer(link_group)

            links = Link.objects.filter(group=link_group)

            link_serializer = LinkSerializer(links, many=True)

            response = {
                'link_group': link_group_serializer.data,
                'links':link_serializer.data
            }

            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"Error":"Link Group or User not Found"}, status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request, group_id):
        user_id = request.user.id

        try:
            
            link_group = LinkGroup.objects.filter(id = group_id, group_creator__id= user_id).first()
            link_group_serializer = LinkGroupSerializer(link_group, data=request.data.get('link_group'), partial=True)
            link_group_serializer.is_valid(raise_exception=True)
            link_group_serializer.save(group_creator_id = user_id)

            links_data = request.data.get('links',[])
            
            #received_link_ids = [links_data.get('id') for link_data in links_data]
            received_link_ids = [link_data.get('id') for link_data in links_data]

            print(received_link_ids)

            Link.objects.filter(group = link_group).exclude(id__in=received_link_ids).delete()

            for link_data in links_data:
                link_id = link_data.get('id')
                if link_id is None:
                    link_data['group'] = link_group.id
                    link_data['creator'] = user_id
                    link_serializer = LinkSerializer(data=link_data, partial=True)
                else:
                    # Try to get the existing link by ID
                    link = Link.objects.filter(id=link_id, group=link_group).first()
                    link_serializer = LinkSerializer(link, data=link_data, partial=True)

                link_serializer.is_valid(raise_exception=True)
                link_serializer.save()
            

            updated_links = Link.objects.filter(group__id= group_id, group__group_creator__id=user_id)
            updated_links_group_serializer = LinkGroupSerializer(link_group)
        
            response_data = {
                'link_group': updated_links_group_serializer.data,
                'links':LinkSerializer(updated_links, many=True).data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print('Error on line {}'.format(sys.exc_info()[-1].tb_lineno), type(e).__name__, e)
            return Response({"Error":"Link Group or User not Found "+str(e)}, status=status.HTTP_404_NOT_FOUND)
        

class UserLinkGroupAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        link_groups = LinkGroup.objects.filter(group_creator__id=user_id)
        serializer = LinkGroupSerializer(link_groups, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request,linkgroup_id=None):
        user_id = request.user.id

        if linkgroup_id:
            link_group = LinkGroup.objects.get(id=linkgroup_id, group_creator__id=user_id)
            serializer = LinkGroupSerializer(link_group, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        else:
            unique_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
            data = {'unique_string': unique_string, 'group_creator':user_id, **request.data}
            serializer = LinkGroupSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save(group_creator_id= user_id)

        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, linkgroup_id):
        user_id = request.user.id

        try:
            link_group = LinkGroup.objects.get(id = linkgroup_id, group_creator__id = user_id)
            
            with transaction.atomic():
                Link.objects.filter(group = link_group).delete()

                link_group.delete()
            
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({"Error":"Link Group or User not Found"}, status=status.HTTP_404_NOT_FOUND)
    

class GroupLinksPublicAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, unique_string):

        try:
           
            link_group = LinkGroup.objects.get(unique_string=unique_string)
            link_group_serializer = LinkGroupSerializer(link_group)

            links = Link.objects.filter(group=link_group)

            link_serializer = LinkSerializer(links, many=True)

            response = {
                'link_group': link_group_serializer.data,
                'links':link_serializer.data
            }

            return Response(response, status=status.HTTP_200_OK)
        except LinkGroup.DoesNotExist:
            return Response({"Error":"Link Group not Found"}, status=status.HTTP_404_NOT_FOUND)




