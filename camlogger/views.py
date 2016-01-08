from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def index(request):
    """
    Show the landing page
    """
    response_context = dict()
    return render_to_response('index.html',  response_context,context_instance=RequestContext(request))

