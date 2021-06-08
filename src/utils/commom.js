// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
export const createGuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

export const sleep = async (fn, time) => {
  await new Promise((res) => {
    setTimeout(() => {
      res()
    }, time);
  })
  return typeof fn === 'function' ? fn() : Promise.resolve(fn);
};

export function loadJS(url, crossing = false) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = resolve;
    script.onerror = reject;
    if (!crossing) {
      script.crossOrigin = "anonymous";
    }

    script.src = url;
    document.body.appendChild(script);
  });
}

export function loadCSS(url) {
  return new Promise((resolve, reject) => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.onload = resolve;
    style.onerror = reject;
    style.href = url;
    document.body.appendChild(style);
  });
}

export function loadSource(
  url,
  {
    header = new Headers(),
    responseType = "blob",
    onload,
    onprogress,
    noUrl = false,
  } = {}
) {
  const xhr = new XMLHttpRequest();
  const promise = new Promise((resolve, reject) => {
    xhr.responseType = responseType;

    xhr.onload = function () {
      let result = xhr.response;
      if (responseType === "blob" && !noUrl) {
        result = URL.createObjectURL(xhr.response);
      }
      if (onload instanceof Function) onload(result);
      resolve(result);
    };
    xhr.onerror = reject;
    // xhr.addEventListener("abort", () => {
    //   console.log("abort");
    // });
    // xhr.onloadend = () => {
    //   console.log("load end");
    // };
    if (onprogress instanceof Function)
      xhr.onprogress = function (xhrObj) {
        onprogress(xhrObj.loaded / xhrObj.total,xhrObj);
      };
    xhr.open("GET", url, true);
    header.forEach((value, key) => {
      xhr.setRequestHeader(key, value);
    });
    xhr.send();
  });
  return Object.assign(promise, {
    close: () => {
      xhr.abort();
    },
  });
}

export function multiplexLoad(url, size, threads = 5) {
  const threadArr = [];
  let extra = size % threads;
  let slice = (size - extra) / threads;

  for (let i = 0, index = -1; i < threads; i++) {
    if (i !== threads - 1) {
      threadArr.push([index + 1, (index += slice)]);
    } else {
      threadArr.push([index + 1, (index += slice + extra)]);
    }
  }

  const loaders = threadArr.map((range) => {
    const header = new Headers();
    header.append("Range", `bytes = ${range[0]} - ${range[1]}`);
    return loadSource(url, { header, responseType: "blob", noUrl: true });
  });
  return Object.assign(
    Promise.all(loaders).then((responses) => {
      const blob = new Blob(responses);
      return Promise.resolve(URL.createObjectURL(blob));
    }),
    {
      close: () => {
        loaders.forEach((item) => item.close());
      },
    }
  );
}

// 限制并发数
export const parallelFetch = (fetchs, limit = 5) =>
  new Promise((res, rej) => {
    const len = fetchs.length;
    const result = Array(len).fill(NaN);
    let count = 0;
    while(count < limit) next();

    function next() {
      let cur = count++;
      if (cur >= len) { 
        if (!result.includes(NaN)) res(result);
        return;
      }
      fetchs[cur].then(r => {
        result[cur] = r;
      }).catch(r => {
        rej[r];
      }).finally(_ => {
        if(cur < len) next();
      })
    }
  });

export const validatePhone = value => /^1[3456789]\d{9}$/.test(value)
