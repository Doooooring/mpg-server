/**
 * @api {get} /news/preview
 * @apiVersion 1.0.0
 * @apiName Get News Preview List
 * @apiGroup News
 *
 * @apiQuery {number} page News Preview Offset
 * @apiQuery {number} limit News Preview Limit
 * @apiQuery {string} keyword News Preview keyword filter
 *
 * @apiSuccess {Boolean} success API State
 * @apiSuccess {Object} result API Result
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success": true,
 *          "result": {
 *              "news": [
 *                  {
 *                      "_id": "string",
 *                      "order": "number",
 *                      "title": "string",
 *                      "summary": "string",
 *                      "keywords": ["string"],
 *                      "state": "boolean"
 *                  }
 *              ]
 *          }
 *      }
 */
