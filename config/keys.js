module.exports = {
	email : {
		user : "", // EMAIL_ADDRESS,
		password : "", // PASSWORD,
		mailingService : "", // If sending from domain, type domain here else leave empty with quotes "",
		//otherwise, 
		host : "", // If using service like gmail type service name like - GMAIL ,else leave empty with quotes "".
    		   //Cannot leave both service and host empty. Either use service or host.
	},
	
	aws :  {
		bucket : "", // BUCKET_NAME,
		s3AccessKey : "", // IAM_AccessKey,
		s3SecretAccessKey : "", // IAM_SecretAccessKey,
		region : "", // BUCKET_REGION
	},

	db_address : "", //  Add database address of hosted mongodb like mLab, mongodb on aws.
            	  //Url should be of the form - mongodb: //username: password@databse_url

	modonerUser : {
		email : "", // email address of modoner,
		departmentName : "", // "Ministry for Development of North Eastern Region",
		pass : "", // password of modoner
	},

	api: {
		route : "", // API_ROUTE,
		route_abuse : "", // CHECK_COMMENT_ABUSE_ROUTE,
		username : "MODONER",
		password : "MODONER"
	}
}