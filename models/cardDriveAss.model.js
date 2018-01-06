import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const cardDriveSchema = new mongoose.Schema({
    drivememo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Drivememo',
        required: 'Card drive assignment requires a drivememo'
    },
    entryTime: {
        type: Date,
        required: 'Card drive entry time is required'
    },
    cost: {
        type: Number,
        required: 'Card drive entry needs a cost'
    }
});


function autopopulate(next) {
    this.populate('drivememo');
    next();
  }
  
  cardDriveSchema.pre('find', autopopulate);
  cardDriveSchema.pre('findOne', autopopulate);

export default mongoose.model('CardDrive', cardDriveSchema);