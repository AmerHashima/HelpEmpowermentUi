export interface AssignedDashboard {
  assignedCourses: number;
  activeCourses: number;
  studentsCount: number;
  reservationsCount: number;
  totalRevenue: number;
  myRevenue: number;
  pendingRevenue: number;
  paidRevenue: number;
  upcomingLiveSessions: number;
  courses: CourseDashboardStatistics[];
}

export interface CourseDashboardStatistics {
  courseId: string;
  courseCode: string;
  courseName: string;
  examSimulatorReservations: number;
  recordedVideoReservations: number;
  liveCourseReservations: number;
  totalReservations: number;
}
