/**
 * @api {get} /news/preview Request News Preivews
 * 
 * @apiVersion        1.0.0
 * @apiName GetNewsPreviewList
 * @apiGroup News
 *
 * @apiQuery {number} page News Preview Offset
 * @apiQuery {number} limit News Preview Limit
 * @apiQuery {string} keyword News Preview keyword filter
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
         "success": true,
         "result": {
         "news": [
                    {
                      "_id": "string",
                      "order": "number",
                      "title": "string",
                      "summary": "string",
                      "keywords": ["string"],
                      "state": "boolean"
                  
                    }
                ]
            }
        }
 */

/**
 * @api {get} /news/preview Request News Preivews
 * 
 * @apiVersion        1.0.0
 * @apiName GetNewsDetail
 * @apiGroup News
 *
 * @apiQuery {number} page News Preview Offset
 * @apiQuery {number} limit News Preview Limit
 * @apiQuery {string} keyword News Preview keyword filter
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
         "success": true,
         "result": {
         "news": [
                    {
                      "_id": "string",
                      "order": "number",
                      "title": "string",
                      "summary": "string",
                      "keywords": ["string"],
                      "state": "boolean"
                  
                    }
                ]
            }
        }
 */        
