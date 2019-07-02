const utils = {

  /**
   * Smooth page scrolling to position
   * @param {number} stopY, default to top of page
   */
  smoothScroll(stopY = 0) {
    const startY = window.pageYOffset;
    const distance = stopY > startY ? stopY - startY : startY - stopY;

    let speed = Math.round(distance / 100);

    if (speed >= 20) {
      speed = 20;
    }

    const step = Math.round(distance / 25);
    let leapY = stopY > startY ? startY + step : startY - step;
    let timer = 0;

    if (stopY > startY) {
      for (let i = startY; i < stopY; i += step) {
        setTimeout(() => window.scrollTo(0, leapY), timer * speed);
        leapY += step;

        if (leapY > stopY) leapY = stopY;
        timer++;
      }
      return;
    }

    for (let i = startY; i > stopY; i -= step) {
      setTimeout(() => window.scrollTo(0, leapY), timer * speed);
      leapY -= step;

      if (leapY < stopY) leapY = stopY;
      timer++;
    }
  },

  lazyLoadingImage() {
    const io = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        //console.log(entry)
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          img.src = src;
          img.onload = () => {
            img.removeAttribute('data-src');
            self.unobserve(entry.target);
          };
        }
      });
    }, {
        rootMargin: '500px',
      });

    const images = document.getElementsByTagName('img');
    Array.from(images).forEach(img => {
      if (img.dataset.src) {
        io.observe(img);
      }
    });
  },

  getLocationFromUser(user) {
    let locationObj = null;

    if (user && Array.isArray(user.locations_object) && user.locations_object.length > 0) {
      locationObj = user.locations_object[0].location.coordinates;
      user.locations_object.map(location => {
        if (location.default) {
          locationObj = location.location.coordinates;
        }
      });
    }

    return locationObj;
  },


  getLocationsById(user) {
    const locationsById = {};

    if (!!user
      && user.locations_object
      && Array.isArray(user.locations_object)
      && user.locations_object.length > 0) {
      user.locations_object.map(location => {
        locationsById[location.id] = location.name;
      });
    }

    return locationsById;
  },

  getDistance(distanceWet) {
    let distance = parseInt(distanceWet, 10);

    if (distance > 1000) {
      distance = distance / 1000;
      distance = Math.round(distance * 100) / 100;
      distance = `${distance} км`;
    } else {
      distance = `${distance} м`;
    }

    return distance;
  },

  /**
   * Convert array of obj with 'id' prop to object with key = id, value = obj
   * [{id: 'id', props}, ...] -> {'id': {id: 'id', props}, ...}
   */
  byIds(array) {
    if (Array.isArray(array) && array.length) {
      const res = {};
      array.forEach(item => {
        if (item.id) {
          res[item.id] = { ...item };
        }
      });
      return res;
    } else {
      return [];
    }
  },

  /**
   * Convert array of obj with 'filter_name' prop to object with key = filter_name, value = obj
   * [{filter_name: 'filter_name', props}, ...] -->
   * {'filter_name': {filter_name: 'filter_name', props}, ...}
   */
  byFilterNames(array) {
    if (Array.isArray(array) && array.length) {
      const res = {};
      array.forEach(item => {
        if (item.filter_name) {
          res[item.filter_name] = { ...item };
        }
      });
      return res;
    } else {
      return null;
    }
  },

};

export default utils;
