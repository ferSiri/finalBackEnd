const express=require('express');
const ejs=require('ejs');
const app=express();
const faker=require('faker');
const mongoose=require('mongoose');
const multer=require('multer');

app.use('/assets/', express.static(__dirname + '/../public/'));

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images/productos/');
	},
	filename: function (req, file, cb) {
		let imgName = req.body.nombre.replace(/ /g, '-').toLowerCase();
		let ext = file.originalname.substr(file.originalname.length - 4);
		cb(null, imgName + ext);
	}
});

let upload = multer({ storage: storage });

app.listen(3030,()=>console.log('servidor 3030 is on'));

app.set('view engine','ejs');

app.set('views', './src/views/');

mongoose.connect('mongodb://localhost/dbTienda');

const productSchema = new mongoose.Schema({
	slug: { type: String, required: true },
	nombre: { type: String, required: true },
	precio: { type: String, required: true },
	categoria: { type: String, required: true },
	desc: { type: String, required: true },
	longDesc: { type: String, required: true },
	pdtoImage: { type: String, required: true }
}, { versionKey: false });

const Producto = mongoose.model('producto', productSchema);

Producto.find({}, (error, result) => {
	if (error) console.log(error);
	else {
		if (result.length ===0) {
			for (var i = 1; i <= 12; i++) {
				let pdtoName = faker.commerce.productName();
				let slugText = pdtoName.replace(/ /g, '-').toLowerCase();
				Product.create({
					slug: slugText,
					pdtoName: pdtoName,
					precio: faker.commerce.price(),
					desc: faker.lorem.sentence(),
					longDesc: faker.lorem.sentences(),
					pdtoImage: 'no-image.png'
				}, (error, result) => {
					if (error) console.log('El error fue: ' + error);
					else console.log('Resultado del create: ' + result);
				});
			}
		}
	}
});

app.get('/', (req, res) => {
	Producto.find({}, (error, result) => {
		if (error) console.log(error);
		else res.render('index', { losProductos: result });
	});
});

app.get('/verTodo', (req, res) => {
	Producto.find({}, (error, result) => {
		if (error) console.log(error);
		else res.render('verTodo', { losProductos: result });
	});
});

app.get('/discos', (req, res) => {
	Producto.find({}, (error, result) => {
		if (error) console.log(error);
		else res.render('discos', { losProductos: result });
	});
});

app.get('/libros', (req, res) => {
	Producto.find({}, (error, result) => {
		if (error) console.log(error);
		else res.render('libros', { losProductos: result });
	});
});

app.get('/new', (req, res) => {
	Producto.find({}, (error, result) => {
		if (error) console.log(error);
		else res.render('new', { losProductos: result });
	});
});
//cambiar find por findOne en detallebvbglg
app.get('/detalle/:slug', (req, res) => {
	Producto.findOne({slug:req.params.slug, _id:req.query.id}, (error, result) => {
		if (error) console.log(' Consulta:',error);
		else res.render('detalle', { losProductos: result });
	});
});

app.post('/new', upload.single('pdtoImage'), (req, res) => {
	//  res.send({ body: req.body, file: req.file });
	let slug = req.body.nombre.trim().replace(/ /g, '-').toLowerCase();
	let pdtoName = req.body.nombre.trim();
	let pdtoPrice = req.body.precio.trim();
	let pdtoCat= req.body.categoria.trim();
	let pdtoDesc= req.body.desc.trim();
	let pdtoLongDesc= req.body.longDesc.trim();

	if (pdtoName === '' || pdtoPrice === ''|| pdtoCat === ''|| pdtoDesc === ''|| pdtoLongDesc === '') {
		res.render('new', { errors: 'Todos los campos son obligatorios' });
	} else {
	Producto.create({
		slug:slug,
		nombre: pdtoName,
		precio: pdtoPrice,
		categoria: req.body.categoria,
		desc: req.body.desc,
		longDesc: req.body.longDesc,
		pdtoImage: req.file.filename
	}, (error, result) => {
		if (error) console.error(error);
		else res.redirect('/');
	});
}});

app.use((req, res, next)=>{
	res.status(404).render('404');
});