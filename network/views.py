import json
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post


def index(request):
        
        # Check if logged in
        if request.user.is_authenticated:
            
            # Get current user
            current_user = request.user

            # Get posts and render
            posts = Post.objects.all().order_by('-timestamp')

            # Pagination
            paginator = Paginator(posts, 10) # 10 posts per page
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)

            return render(request, "network/index.html", {
                "page_obj": page_obj,
                "current_user": current_user
            })

        else:
            return render(request, "network/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def new_post(request):
    
    # Make sure it's POST
    if request.method == 'POST':

        # Get post data
        body = request.POST["body"]
        user = request.user

        # Save post
        post = Post(body=body, user=user)
        post.save()
        return HttpResponseRedirect(reverse("index"))
        
@login_required
def profile(request, username):

    # Get user data
    user_profile = User.objects.get(username = username)

    # Get user posts
    posts = reversed(Post.objects.filter(user=user_profile.id))

    # Get current user
    current_user = request.user
    
    # Render template
    return render(request, "network/profile.html", {
        "user_profile": user_profile,
        "posts": posts,
        "current_user": current_user
    })

@login_required
def follow(request):
    
    # Make sure method is post
    if request.method == 'POST':

        # Get current user
        current_user = request.user
    
        # Get user to follow 
        user_to_follow_id = request.POST["userid"]
        user_to_follow = User.objects.get(id = user_to_follow_id)

        # Set user as follower and save
        current_user.following.add(user_to_follow)
        current_user.save()

        # Reload profile
        username = user_to_follow.username
        return HttpResponseRedirect(reverse("profile", args=(username,)))

@login_required
def unfollow(request):

    # Make sure method is post
    if request.method == 'POST':

        # Get current user
        current_user = request.user

        # Get user to unfollow 
        user_to_unfollow_id = request.POST["userid"]
        user_to_unfollow = User.objects.get(id = user_to_unfollow_id)

        # Set user as follower and save
        current_user.following.remove(user_to_unfollow)
        current_user.save()

        # Reload profile
        username = user_to_unfollow.username
        return HttpResponseRedirect(reverse("profile", args=(username,)))

@login_required
def following(request):
        
        # Check if logged in
        if request.user.is_authenticated:

            # Get current user
            current_user = User.objects.get(id = request.user.id)

            # Get users the user follows
            followed_users = current_user.following.all()

            # Get followed user posts
            followed_posts = Post.objects.filter(user__in=followed_users).order_by('-timestamp')

             # Pagination
            paginator = Paginator(followed_posts, 10) # 10 posts per page
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)

            return render(request, "network/following.html", {
                "page_obj": page_obj,
                "followed_posts": followed_posts
            })

@login_required
@csrf_exempt
def edit_post(request):
    # Make sure it's POST
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
        # Get post data
        postId = data.get("postId", "")
        body = data.get("body", "")
    
        # Save post
        post = Post.objects.get(id = postId)
        post.body = body
        post.save()
        return JsonResponse({'message': 'Post succesfully edited.'},status=201)
    except Exception as e:
        # Handle an exception
        return JsonResponse({'status': 'error', 'message': str(e)})

@login_required
@csrf_exempt
def like_post(request):
    # Make sure it's POST
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required"}, status=400)
    try:
        data = json.loads(request.body)
        # Get postId
        postId = data.get("postId", "")

        # Get current_user
        current_user = request.user

        # Update and save post
        post = Post.objects.get(id = postId)
        post.likes.add(current_user)
        post.save()
        return JsonResponse({'message': 'Post succesfully liked.'},status=201)
    except Exception as e:
        # Handle an exception
        return JsonResponse({'status': 'error', 'message': str(e)})

@login_required
@csrf_exempt
def unlike_post(request):
     # Make sure it's POST
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required"}, status=400)
    
    try:
        data = json.loads(request.body)
        # Get postId
        postId = data.get("postId", "")

        # Get current_user
        current_user = request.user

        # Update and save post
        post = Post.objects.get(id = postId)
        post.likes.remove(current_user)
        post.save()
        return JsonResponse({'message': 'Post succesfully unliked.'},status=201)
    except Exception as e:
        # Handle an exception
        return JsonResponse({'status': 'error', 'message': str(e)})
