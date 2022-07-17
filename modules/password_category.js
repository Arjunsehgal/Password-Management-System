const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser: true, });
var conn =mongoose.Collection;
var passcatSchema =new mongoose.Schema({
    password_category: {type:String, 
        required: true,
        index: {
            unique: true,        
        }
    },
	
    date:{
        type: Date, 
        default: Date.now }
});
passcatSchema.plugin(mongoosePaginate);
var passcatModel = mongoose.model('password_categories', passcatSchema);
module.exports=passcatModel;