import isUrl from 'is-url';

/**
 * Encode request parameters.
 * @param {object} params List of query params.
 */
export const encodeParams = (params = {}) => {
  return Object.keys(params).reduce(function(a, k) {
    a.push(k + '=' + encodeURIComponent(params[k]));
    
    return a;
  },[]).join('&');
}

/**
 * Get request URL.
 * @param {string} apiKey Application access key.
 * @param {string} url    Url to extract metadata/embed.
 * @param {object} params Include oarams in the request.
 */
export const buildIframelyUrl = (apiKey, url, params = {}) => {
  const queryString = encodeParams(params);
  
  return `http://iframe.ly/api/iframely?api_key=${apiKey}&url=${url}&${queryString}`;
};

/**
 * Retrieve metadata to embed the URL.
 * @param {string} text    Candidate URL.
 * @param {object} options Configuration.
 */
export const fetchUrlMetadata = async (text, options) => {
  const urlText = text.trim();

  if (!isUrl(urlText)) {
    return null;
  }

  try {
    const url = buildIframelyUrl(options.apiKey, text, options.params);
    const data = await options.onRequest(url);

    return data && data.html ? data : null;
  }
  catch(err) {
    return null;
  }
};
