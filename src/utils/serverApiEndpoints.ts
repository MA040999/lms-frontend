enum SERVER_API_ENDPOINTS {
  ADD_NEW_USER = '/user',

  //Course Endpoints
  GET_COURSES = '/course',
  GET_USER_COURSES = '/course/user',
  GET_USER_COURSE_PROGRESS = '/course/user/',
  GET_USER_COURSE_VERIFY_CERTIFICATE = '/course/verify/',
  ENROLL_COURSE = '/course/enrollment',
  POST_USER_LECTURE_PROGRESS = '/course/lecture/user/progress',
  
  //Quiz Endpoints
  GET_QUIZ_BY_MODULE = '/course/module/',
}

export default SERVER_API_ENDPOINTS;
