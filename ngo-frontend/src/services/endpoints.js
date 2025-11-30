export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://192.168.0.195:8000/api"; // HOME
// export const BASE_API_URL =
//   import.meta.env.VITE_API_URL || "http://192.168.1.32:8000/api";  // OFFICE

export const BASE_WS_URL =
  import.meta.env.VITE_WS_URL || "ws://192.168.0.195:8000";

export const BASE_MEDIA_URL =
  import.meta.env.VITE_API_URL || "http://192.168.0.195:8000";

export const ENDPOINTS = {};

// ====================== AUTH ========================
ENDPOINTS.AUTH = {
  LOGIN: `${BASE_API_URL}/auth/login/`,
  ROTATE_TOKEN: `${BASE_API_URL}/auth/rotate-token/`,              // refresh token
  UPDATE_SELF_PASSWORD: `${BASE_API_URL}/auth/update-self-password/`,
  UPDATE_MEMBER_PASSWORD: `${BASE_API_URL}/auth/update-member-password/`,
  PROFILE: `${BASE_API_URL}/auth/profile/`,
};

// ====================== MEMBERS =====================
ENDPOINTS.MEMBERS = {
  CREATE: `${BASE_API_URL}/members/become-member/`,
  LIST: `${BASE_API_URL}/members/get-members/`,
  APPROVE: `${BASE_API_URL}/members/approve-member/`,
  BLOCK: `${BASE_API_URL}/members/block-member/`,
  ADD: `${BASE_API_URL}/members/add-member/`,
  UPDATE_MEMBER_DETAIL: `${BASE_API_URL}/members/update-member-detail/`,
  UPDATE_SELF_DETAIL: `${BASE_API_URL}/members/update-self-detail/`,
};

// ====================== BANNERS =====================
ENDPOINTS.BANNERS = {
  ADD: `${BASE_API_URL}/banners/add-banner/`,
  UPDATE: `${BASE_API_URL}/banners/update-banner/`,
  LIST: `${BASE_API_URL}/banners/get-banners/`,
  DELETE: `${BASE_API_URL}/banners/delete-banner/`,
};

// ====================== ROLES =====================
ENDPOINTS.ROLES = {
  LIST: `${BASE_API_URL}/roles/get-roles/`,
  ADD: `${BASE_API_URL}/roles/add-role/`,
  UPDATE: `${BASE_API_URL}/roles/update-role/`,
  DELETE: `${BASE_API_URL}/roles/delete-role/`,
};

// ====================== ANNOUNCEMENT =====================
ENDPOINTS.ANNOUNCEMENT = {
  LIST: `${BASE_API_URL}/announcements/get-announcements/`, // GET 
  ADD: `${BASE_API_URL}/announcements/add-announcement/`,  // POST
  UPDATE: `${BASE_API_URL}/announcements/update-announcement/`,  // POST
  DELETE: `${BASE_API_URL}/announcements/delete-announcement/`,  // DELETE
};



// LIST POST ROUTES 
// {
//     "search":"",
//     "page_number":1,
//     "page_size":25,
//     "ids":[]
// }

// ====================== GALLERY =====================
ENDPOINTS.GALLERY = {
  LIST: `${BASE_API_URL}/gallery/get-gallery-items/`, // POST 
  ADD: `${BASE_API_URL}/gallery/add-gallery-item/`,  // POST
  UPDATE: `${BASE_API_URL}/gallery/update-gallery-item/`,  // POST
  DELETE: `${BASE_API_URL}/gallery/delete-gallery-item/`,  // DELETE
};

// Fields -> title , description , file , file_type , button_text , button_url , is_active
// extra -> update , delete : pk 


// ====================== CAMPAIGN =====================
ENDPOINTS.CAMPAIGN = {
  LIST: `${BASE_API_URL}/campaign/get-campaigns/`, // POST 
  ADD: `${BASE_API_URL}/campaign/add-campaign/`,  // POST
  UPDATE: `${BASE_API_URL}/campaign/update-campaign/`,  // POST
  DELETE: `${BASE_API_URL}/campaign/delete-campaign/`,  // DELETE
};
// Fields -> title ,subtitle , html_body , is_active , goal_amount ( 24000 ) , collected_amount , button_text , button_url , youtube_video_id , instagram_link , twitter_link , wikipedia_link , website_link , website_link , other_field_json "{}" , thumbnail , video_or_file 




// ====================== NEWS =====================
ENDPOINTS.NEWS = {
  LIST: `${BASE_API_URL}/news/get-news/`, // POST 
  ADD: `${BASE_API_URL}/news/add-news/`,  // POST
  UPDATE: `${BASE_API_URL}/news/update-news/`,  // POST
  DELETE: `${BASE_API_URL}/news/delete-news/`,  // DELETE
};


// Fields -> title ,subtitle , html_body , is_active , button_text , button_url , youtube_video_id , instagram_link , twitter_link , wikipedia_link , website_link , website_link , other_field_json "{}" , thumbnail , video_or_file 


// ====================== EVENT =====================
ENDPOINTS.EVENT = {
  LIST: `${BASE_API_URL}/event/get-events/`, // POST 
  ADD: `${BASE_API_URL}/event/add-event/`,  // POST
  UPDATE: `${BASE_API_URL}/event/update-event/`,  // POST
  DELETE: `${BASE_API_URL}/event/delete-event/`,  // DELETE
};

// Fields -> title ,subtitle , html_body , is_active , button_text , button_url , youtube_video_id , instagram_link , twitter_link , wikipedia_link , website_link , website_link , other_field_json "{}" , thumbnail , video_or_file 





// ====================== TESTIMONIALS =====================
ENDPOINTS.TESTIMONIALS = {
  LIST: `${BASE_API_URL}/testimonials/get-testimonials/`, // POST 
  ADD: `${BASE_API_URL}/testimonials/add-testimonial/`,  // POST
  UPDATE: `${BASE_API_URL}/testimonials/update-testimonial/`,  // POST
  DELETE: `${BASE_API_URL}/testimonials/delete-testimonial/`,  // DELETE
};


// ====================== SITE CREDENTIAL =====================
ENDPOINTS.SITE_CREDENTIAL = {
  GET: `${BASE_API_URL}/sitecredential/`, // GET request without params
  GET_ADMIN: `${BASE_API_URL}/get-credentials-for-admin/`,  // GET request without params
  UPDATE: `${BASE_API_URL}/site-data/update-credentials/`,  // POST




  UPDATE_SITE_DATA: `${BASE_API_URL}/site-data/update-site-data/`,  // POST
  GET_SITE_DATA: `${BASE_API_URL}/site-data/get-site-data/`,  // GET



  GET_ABOUT_DATA: `${BASE_API_URL}/site-data/get-about-data/`,  // GET
  UPDATE_ABOUT_DATA: `${BASE_API_URL}/site-data/update-about-data/`,  // POST

  GET_MISSION_DATA: `${BASE_API_URL}/site-data/get-mission-data/`,  // GET
  UPDATE_MISSION_DATA: `${BASE_API_URL}/site-data/update-mission-data/`,  // POST

  GET_VISION_DATA: `${BASE_API_URL}/site-data/get-vision-data/`,  // GET
  UPDATE_VISION_DATA: `${BASE_API_URL}/site-data/update-vision-data/`,  // POST


  GET_OBJECTIVE_DATA: `${BASE_API_URL}/site-data/get-objective-data/`,      // GET
  UPDATE_OBJECTIVE_DATA: `${BASE_API_URL}/site-data/update-objective-data/`,  // POST

  GET_ACHIVEMENT_DATA: `${BASE_API_URL}/site-data/get-achivement-data/`,      // GET
  UPDATE_ACHIVEMENT_DATA: `${BASE_API_URL}/site-data/update-achivement-data/`, // POST

  GET_ACHIVEMENT_DATA: `${BASE_API_URL}/site-data/get-achivement-data/`,      // GET
  UPDATE_ACHIVEMENT_DATA: `${BASE_API_URL}/site-data/update-achivement-data/`, // POST

  ADD_CERTIFICATE: `${BASE_API_URL}/site-data/add-certificate/`,      // POST
  LIST_CERTIFICATES: `${BASE_API_URL}/site-data/get-certificates/`,      // GET ( if in params id=3 , then filter by id )
  UPDATE_CERTIFICATE: `${BASE_API_URL}/site-data/update-certificate/`,      // POST
  DELETE_CERTIFICATE: `${BASE_API_URL}/site-data/delete-certificate/`,      // DELETE
  
  
  ADD_YOUTUBE_VIDEO: `${BASE_API_URL}/site-data/add-youtube-video/`,      // ADD
  UPDATE_YOUTUBE_VIDEO: `${BASE_API_URL}/site-data/update-youtube-video/`,      // ADD
  GET_YOUTUBE_VIDEOS: `${BASE_API_URL}/site-data/get-youtube-videos/`,      // ADD
  DELETE_YOUTUBE_VIDEO: `${BASE_API_URL}/site-data/delete-youtube-video/`,      // ADD


};

// ====================== DONATION =====================
ENDPOINTS.DONATION = {
  CREATE_ORDER: `${BASE_API_URL}/donations/create-order/`,
  VERIFY_PAYMENT: `${BASE_API_URL}/donations/verify-payment/`,
  ALL_DONATION_HISTORY: `${BASE_API_URL}/donations/all-donation-history/`,
};

// ====================== ADMIN ========================
ENDPOINTS.ADMIN = {
  DASHBOARD: `${BASE_API_URL}/admin/dashboard/`,
  REPORTS: `${BASE_API_URL}/admin/reports/`,
};
