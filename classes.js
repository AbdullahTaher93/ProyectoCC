var data = {
  heartrate:0,
  peak:0,
  time:0,
  latitude:0,
  longitude:0,
  username:"",


  setHeartRate: function(hr) {
    this.heartrate=hr;
  },
  getHeartRate: function(){
    return heartrate;
  },
  getPeak: function(){
    return peak;
  },
  setPeak: function(peak) {
    this.peak=peak;
  },
  setTime: function(time) {
    this.time=time;
  },
  getTime: function(){
    return time;
  },
  setLatitude: function(latitude){
    this.latitude=latitude;
  },
  getLatitude: function() {
    return latitude;
  },
  setLongitude: function(longitude){
    this.longitude=longitude;
  },
  getLongitude: function(){
    return longitude;
  },
  getUserName: function(){
    return username;
  },
  setUsername: function(username){
    this.username=username;
  }

}

storage=[];
size=0;

function storeData(hr,pk,lat,lng,user){
  let clone = {};
  for (let key in data) {
    clone[key] = data[key];
  }

  clone.setHeartRate(hr);
  clone.setPeak(pk);
  clone.setLatitude(lat);
  clone.setLongitude(lng);
  clone.setUsername(user);
  clone.setTime(Date.now());
  storage.push(clone);
  size=size+1;
}

function editData(i,hr,pk,lat,lng,user){

  storage[i].setHeartRate(hr);
  storage[i].setPeak(pk);
  storage[i].setLatitude(lat);
  storage[i].setLongitude(lng);
  storage[i].setUsername(user);

}

function deleteData(i){
  output=storage.splice(i,1);
  size=size-1;
  return output;
}

module.exports = {
  data,
  storage,
  size,
  storeData,
  editData,
  deleteData
}
