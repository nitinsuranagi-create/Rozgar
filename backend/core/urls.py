from django.urls import path

from .views import (
    ai_chat_view,
    active_workers_count_view,
    application_decision_view,
    application_exam_submit_view,
    applications_view,
    exam_overview_view,
    exam_questions_view,
    jobs_view,
    login_view,
    logout_view,
    signup_view,
)

urlpatterns = [
    path("auth/signup", signup_view, name="signup"),
    path("auth/login", login_view, name="login"),
    path("auth/logout", logout_view, name="logout"),
    path("auth/active-workers-count", active_workers_count_view, name="active-workers-count"),
    path("jobs", jobs_view, name="jobs"),
    path("applications", applications_view, name="applications"),
    path("applications/<int:application_id>/decision", application_decision_view, name="application-decision"),
    path("applications/<int:application_id>/exam", application_exam_submit_view, name="application-exam"),
    path("exam/questions", exam_questions_view, name="exam-questions"),
    path("exam/overview", exam_overview_view, name="exam-overview"),
    path("ai/chat", ai_chat_view, name="ai-chat"),
]
