import { Schema } from 'mongoose';

export const BusesSchema: Schema = new Schema({
  busNumber: {
    type: String,
    required: true,
  },
  busRoute: {
    type: String,
    required: true,
  }
});
