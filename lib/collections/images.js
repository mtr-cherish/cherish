var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
    allow: {
      contentType: ['image/*'] //Only allows images
    }
  }
});

Images.allow({
  insert: function () {
    return true;
  }
});