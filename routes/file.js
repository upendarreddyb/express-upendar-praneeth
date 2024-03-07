import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

const FileUploadForm = () => {
  return (
    <div>
      <h1>File Upload</h1>
      <Formik
        initialValues={{ file: null }}
        onSubmit={(values, { setSubmitting }) => {
          const formData = new FormData();
          formData.append('file', values.file);

          axios.post('/upload', formData)
            .then(response => {
              console.log('File uploaded successfully:', response.data);
            })
            .catch(error => {
              console.error('Error uploading file:', error);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Field
              type="file"
              name="file"
              onChange={(event) => {
                setFieldValue("file", event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage name="file" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FileUploadForm;




const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
var cors = require('cors')
const bodyParser = require('body-parser')
var fs  = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync("/etc/letsencrypt/live/betacular.live/privkey.pem");
var certificate = fs.readFileSync("/etc/letsencrypt/live/betacular.live/cert.pem");
var credentials = {key: privateKey, cert: certificate};


// Create a MySQL connection
const connection = mysql.createConnection({
  
	host: "localhost",
	user: "root",
	password: "Sonu@2023",
	database: "society"
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../betanew/uploads/'); // Specify the folder where the images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, 'image' + Date.now()  + "."+ file.originalname.split(".").pop()); // Set the file name to be unique
  },
});

const upload = multer({ storage });

// Create an Express app
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

var httpsServer = https.createServer(credentials, app);
// Upload image endpoint
app.post('/upload', upload.array('file',50), (req, res) => {
  // Get the file details
  //const {  path } = req.file;
  //console.log(req.file)
  //console.log(req.body.title)
  const filename = req.body.title;
  
  
  // Insert the file details into the database
  const files = req.files;
  for (let file of files) {
    const { path } = file;
    console.log("--->",path)
    const filepath = path.split("/").pop();
    // Insert the file details into the database
    const sql = 'INSERT INTO images (title, path) VALUES (?, ?)';
    connection.query(sql, [filename, filepath], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image' });
      } 
    });
  }
  res.status(200).json({ message: 'Upload successful' });
});

app.post('/register', (req, res) => {
	var mobile = req.body.mobile;
	
    var password = req.body.password;
	
    if(mobile && password)
    {
		var sql = "INSERT INTO user_login (mobile, password) VALUES ('"+mobile+"', '"+password+"')";
		  connection.query(sql, function (err, result) {
			if (err) {
				res.status(400).send({
				   message: 'Mobile number is already exist'
				});
			}
			if(result)
				res.status(200).json({ message: 'Registed Successfully' });
			
		  });
	}
	else{
		res.status(400).send({
		   message: 'Incorrect Data'
		});
	}
});

app.post('/getUserData', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'select *from user_login WHERE status !=2 ';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});

app.post('/galleryData', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'SELECT title,COUNT(*) as count,path FROM `images` where status=1 GROUP by title';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});

app.put('/updateUserStatus', (req, res) => {
  const id  = req.body.id;
  const  status  = req.body.status;

  console.log(req.body.status)
  const query = 'UPDATE user_login SET status = ? WHERE id = ?';

  connection.query(query, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating status' });
    } else {
      res.json({ message: 'Status updated successfully' });
    }
  });
});

app.post('/getDayBookings', (req, res) => {
	var date = req.body.date;
	const query = 'SELECT * FROM transactions WHERE date like ?';
	//console.log("SELECT * FROM transactions WHERE date like '"+date+"'");
	connection.query(query,[date], function (err, result) {
		if (err){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		//console.log("result",result);
		if(result.length>0){
			
			res.json({"message": result});
		}
		
		else
			res.json({"message": []});
	});

	
});

app.post('/mybookings', (req, res) => {
	var mobile = req.body.mobile;
	con.query("SELECT * FROM transactions WHERE mobile = '"+mobile+"'", function (err, result) {
		if (err){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(result.length>0){
			
			res.json({"message": result});
		}
		
		else
			res.json({"message": []});
	});

	
});

app.delete('/deleteUser/:id', (req, res) => {
  const { id } = req.params;

  const query = 'UPDATE user_login SET status = 2 WHERE id = ?';
  //const query = 'DELETE FROM user_login WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting row' });
    } else {
      res.json({ message: 'user deleted successfully' });
    }
  });
});

app.post('/getImageData', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'select *from images ';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});

app.post('/getTitleImageData', (req, res) => {
  const  title  = req.body.title;
  // Insert the file details into the database
  const sql = 'select *from images where title = ? ';
  connection.query(sql,[title], (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});

app.post('/getAlbumData', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'SELECT title,path,status,count(*) as count FROM `images` where status=1 GROUP by title';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});

app.post('/getDataCount', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'SELECT (SELECT COUNT(*) FROM videos) AS video_count, (SELECT COUNT(*) FROM images) AS image_count, (SELECT COUNT(*) FROM user_login) AS user_count, (SELECT COUNT(*) FROM transactions) AS booking_count';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});
app.put('/updateImageStatus', (req, res) => {
  const id  = req.body.id;
  const  status  = req.body.status;

  console.log(req.body.status)
  const query = 'UPDATE images SET status = ? WHERE id = ?';

  connection.query(query, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating status' });
    } else {
      res.json({ message: 'Status updated successfully' });
    }
  });
});
app.put('/updateTitleImageStatus', (req, res) => {
  const title  = req.body.title;
  const  status  = req.body.status;

  console.log(req.body.status)
  const query = 'UPDATE images SET status = ? WHERE title = ?';

  connection.query(query, [status, title], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating status' });
    } else {
      res.json({ message: 'Status updated successfully' });
    }
  });
});

app.post('/deleteTitleImage', (req, res) => {
  const title  = req.body.title;

  const query = 'DELETE FROM images WHERE title = ?';

  connection.query(query, [title], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting row' });
    } else {
      res.json({ message: 'Row deleted successfully' });
    }
  });
});

app.delete('/deleteImage/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM images WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting row' });
    } else {
      res.json({ message: 'Row deleted successfully' });
    }
  });
});


app.post('/uploadVideoData', (req, res) => {
  // Get the file details
  //const {  path } = req.file;
  console.log(req.title)
  console.log(req.body.title)
  const source = req.body.type;
  const filename = req.body.title;
  const url = req.body.url;
  // Insert the file details into the database
  const sql = 'INSERT INTO videos (title, source,url) VALUES (?, ?, ?)';
  connection.query(sql, [filename, source,url], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload video' });
    } else {
      res.json({ message: 'Video uploaded successfully' });
    }
  });
});
app.post('/getVideoData', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'select *from videos ';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});
app.put('/updateVideoStatus', (req, res) => {
  const id  = req.body.id;
  const  status  = req.body.status;

  console.log(req.body.status)
  const query = 'UPDATE videos SET status = ? WHERE id = ?';

  connection.query(query, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating status' });
    } else {
      res.json({ message: 'Status updated successfully' });
    }
  });
});
app.delete('/deleteVideo/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM videos WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting row' });
    } else {
      res.json({ message: 'Row deleted successfully' });
    }
  });
});


app.post('/newseventsupload', upload.array('file',10), (req, res) => {
  // Get the file details
  const title = req.body.title;
  const happenddate = req.body.happenddate;
  const description = req.body.description;
  
  const files = req.files;
  for (let file of files) {
    const { path } = file;
    console.log("--->",path)
    const filepath = path.split("/").pop();
    // Insert the file details into the database
    const sql = 'INSERT INTO events_news (title, description, happenddate, path) VALUES (?, ?, ?, ?)';
    connection.query(sql, [title, description, happenddate, filepath], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload' });
      } 
    });
  }
  res.status(200).json({ message: 'Upload successful' });
});


app.post('/getNewsEventsData', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'SELECT id, title,path,description,happenddate,status FROM `events_news` where status=1';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});
app.delete('/deleteNewsEvents/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM events_news WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting row' });
    } else {
      res.json({ message: 'Row deleted successfully' });
    }
  });
});
app.put('/updateNewsEventsStatus', (req, res) => {
  const id  = req.body.id;
  const  status  = req.body.status;

  console.log(req.body.status)
  const query = 'UPDATE events_news SET status = ? WHERE id = ?';

  connection.query(query, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating status' });
    } else {
      res.json({ message: 'Status updated successfully' });
    }
  });
});

app.post('/dailyaarti', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'SELECT * FROM `dailyaarti`';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});

app.post('/dailydarshan', (req, res) => {
  
  // Insert the file details into the database
  const sql = 'SELECT * FROM `dailydarshan`';
  connection.query(sql, (error, results) => {
    if (error){
			res.status(400).send({
				message: 'Something went wrong'
			});
		}
		if(results.length>0){
			res.json({"message": results});
		}
		
		else
			res.json({"message": []});
  });
});

// Start the server
/*
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});*/
httpsServer.listen(3000, ()=>{
	console.log("Server running on port 3000");
});
