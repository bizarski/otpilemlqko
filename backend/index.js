const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const STORAGE_DIR = process.env.STORAGE_DIR;
console.log(`STORAGE DIR IS: ${STORAGE_DIR}`);

const HTTP_PORT = 3019;

// Your secret key
const secretKey = 'koeef#Tp!23atrk@#LuT_#r@PaFfE_Ku&r';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));

app.use(cors({
	origin: ['http://localhost:9000']
}));

app.use(function (req, res, next) {
	if (req.headers.origin !== 'http://localhost:9000')
		return next();
	if (req.headers.authorization === secretKey)
		return next();
	res.status(401).end();
});

// app.use(express.urlencoded());
app.use('/public', express.static(path.resolve(STORAGE_DIR)));
app.use('/', express.static(__dirname + '/frontend'));


const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
	// Define the directory where you want to store the uploaded files
	cb(null, path.resolve(STORAGE_DIR, './images/'));
  },
  filename: function (req, file, cb) {
	// Define the filename for the uploaded file
	cb(null, file.originalname);
  }
});

const uploadPostFile = multer({ storage: postStorage });

const mediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
	// Define the directory where you want to store the uploaded files
	cb(null, path.resolve(STORAGE_DIR, './media/'));
  },
  filename: function (req, file, cb) {
	const data = JSON.parse(req.body.data);
	if (data.imageFileName) {
		return cb(null, data.imageFileName[file.originalname]);
	}
	// Define the filename for the uploaded file
	cb(null, data.filename);
  }
});

const uploadMediaFile = multer({ storage: mediaStorage });

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'otpilemlqko';

app.post('/auth', function (req, res) {
	const { username, password } = req.body;
	if (username !== 'klemenza')
		return res.status(401).end();
	if (password !== 'windows123')
		return res.status(401).end();
	res.status(200).end();
});

app.get('/settings', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const settings = await db.collection('settings').findOne({});
	res.json(settings);
});

app.put('/settings', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const settings = await db.collection('settings').findOne({});
	const updateBody = { ...req.body };
	delete updateBody._id;
	await db.collection('settings').updateOne({ _id: settings._id }, { $set: updateBody });
	res.status(200).end();
});


app.get('/menus', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const menus = await db.collection('menus').find({}).limit(6).toArray();
	res.json(menus);
});

app.put('/menus/:id', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const menus = await db.collection('menus').updateOne({ _id: new ObjectId(req.params.id) }, {
		$set: { items: req.body.items }, 
	});
	res.json(menus);
});

app.get('/media', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const query = {};
	
	const files = await db.collection('media').find(query).toArray();
	res.json(files);
});


app.post('/media', uploadMediaFile.array('media'), async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const result = [];
	for (const file of req.files) {
		const outcome = await db.collection('media').insertOne({
			filename: file ? file.filename : null,
		});
		result.push(outcome.insertedId);
	}
	
	res.status(200).json({ insertedIds: result });
});


app.put('/media/:id', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	
	await db.collection('media').updateOne({
		_id: new ObjectId(req.params.id)
	}, {
		$set: req.body
	});
	res.status(200).end();
});


app.get('/media/:id', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const fileId = new ObjectId(req.params.id);
	const file = await db.collection('media').findOne({ _id: fileId });
	
	res.json(file);
});

app.delete('/media/:id', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const fileId = new ObjectId(req.params.id);
	const file = await db.collection('media').findOne({ _id: fileId });
	
	await fs.unlink(path.join(STORAGE_DIR, `./media/${file.filename}`));	
	const result = await db.collection('media').deleteOne({ _id: fileId });

	res.json(result);
});

app.get('/posts', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const query = { deleted: { $ne: true } };

	const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
	const posts = await db.collection('posts').find(query).skip(offset).limit(9).toArray();
	res.json(posts.map(p => ({ _id: p._id, title: p.title, slug: p.slug, image: p.image })));
});

app.post('/posts', uploadPostFile.fields([{ name: 'thumbImage', maxCount: 1}, { name: 'coverImage', maxCount: 1 }]), async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const data = JSON.parse(req.body.data);

	const newRecord = {
		...data,
	};

	const files = req.files;
	if (files.thumbImage && files.thumbImage.length && files.thumbImage[0].filename) {
		newRecord.image = files.thumbImage[0].filename;
	}
	if (files.coverImage && files.coverImage.length && files.coverImage[0].filename) {
		newRecord.coverImage = files.coverImage[0].filename;
	}

	const result = await db.collection('posts').insertOne(newRecord);
	res.status(200).json({ insertedId: result.insertedId });
});

app.put('/posts/:id', uploadPostFile.fields([{ name: 'thumbImage', maxCount: 1}, {name: 'coverImage', maxCount: 1}]), async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const data = JSON.parse(req.body.data);
	const updateObj = {
		title: data.title,
		body: data.body,
		slug: data.slug,
		carouselType: data.carouselType,
		carouselSlides: data.carouselSlides,
		imageCards: data.imageCards,
		deleted: data.deleted,
	};
	
	const files = req.files;
	if (files.thumbImage && files.thumbImage.length && files.thumbImage[0].filename) {
		updateObj.image = files.thumbImage[0].filename;
	}
	if (files.coverImage && files.coverImage.length && files.coverImage[0].filename) {
		updateObj.coverImage = files.coverImage[0].filename;
	}

	await db.collection('posts').updateOne({
		_id: new ObjectId(req.params.id)
	}, {
		$set: updateObj
	});
	res.status(200).end();
});

app.get('/posts/:slug', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const post = await db.collection('posts').findOne({ slug: req.params.slug });

	res.json({ post: post });
});

app.get('/posts/id/:id', async function (req, res) {
	await client.connect();
	const db = client.db(dbName);
	const postId = new ObjectId(req.params.id);
	const post = await db.collection('posts').findOne({ _id: postId });

	res.json({ post: post });
});

console.log(`LISTENING ON: ${HTTP_PORT}`);
app.listen(HTTP_PORT);