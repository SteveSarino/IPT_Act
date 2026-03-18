from django.contrib import admin
from .models import Student, Teacher, Course, Enrollment

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name', 'email')

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('teacher_id', 'first_name', 'last_name', 'email', 'department')
    search_fields = ('first_name', 'last_name', 'email', 'department')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_id', 'description', 'units', 'teacher')
    list_filter = ('teacher',)
    search_fields = ('description',)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('enrollment_id', 'student', 'course', 'enrollment_date', 'status', 'grade')
    list_filter = ('status', 'course')
    search_fields = ('student__first_name', 'student__last_name', 'course__description')
