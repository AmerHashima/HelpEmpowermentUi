export interface UserCourseAssignment {
  oid: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  assignmentTypeId: string;
  assignmentType: string;
  isPrimary: boolean;
  isActive: boolean;
}

export interface SaveUserCourseAssignment {
  userId: string;
  courseId: string;
  assignmentTypeId: string;
  isPrimary: boolean;
  isActive: boolean;
}
