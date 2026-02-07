
from django.db import models

class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    email = models.EmailField(unique=True)
    contact_num = models.CharField(max_length=20) # Changed to CharField for flexibility

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Teacher(models.Model):
    teacher_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=255)
    units = models.IntegerField()
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True) # FK to Teacher

    def __str__(self):
        return self.description

class Enrollment(models.Model):
    enrollment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE) # FK to Student
    course = models.ForeignKey(Course, on_delete=models.CASCADE) # FK to Course
    enrollment_date = models.DateField()
    grade = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"Enrollment for {self.student.first_name} {self.student.last_name} in {self.course.description}"

    class Meta:
        unique_together = ('student', 'course') # Prevent duplicate enrollments for the same student in the same course
