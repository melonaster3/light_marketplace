/*
 * All routes for Listings are defined here
 * Since this file is loaded in server.js into api/listings,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const buyerHelper = require('../lib/buyerHelper');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const queryParams = []
    let queryString = `SELECT * FROM listings JOIN photos ON listings.id = listing_id `


    if (req.query.buying) {
      queryParams.push(`%${req.query.buying}%`);
      queryString += `WHERE title LIKE $${queryParams.length} `;
    }

    if (req.query.min) {
      queryParams.push(req.query.min);
      queryString += `AND price >= $${queryParams.length} `;
    }

    if (req.query.max) {
      queryParams.push(req.query.max);
      queryString += `AND price <= $${queryParams.length} `;
    }

    if (req.query.category) {
      queryParams.push(req.query.category);
      queryString += `AND niche_id = $${queryParams.length} `;
    }

    if (req.query.condition) {
      queryParams.push(req.query.condition);
      queryString += `AND condition = $${queryParams.length} `;
    }



    db.query(queryString, queryParams)
      .then((data) => {
        const templateVars = {
          "listings": data.rows,
        };
        const listings = data.rows;
        //res.json({ listings });
        res.render("listings", templateVars)
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:id", (req,res) => {
    let id = Object.values(req.params)
    const queryParams = []
    let queryString = `SELECT *
    FROM listings JOIN photos ON listings.id = listing_id
    WHERE listings.id = ${id};`



    db.query(queryString, queryParams)
      .then((data) => {
        const templateVars = {
          "listings": data.rows,
        };
        const listings = data.rows;
        //res.json({ listings})
        res.render("listingid", templateVars)
      })
  })

  router.post("/:id", (req, res) => {
    const listingID = Number(Object.values(req.params))
    const userID = req.session.userId.id

    buyerHelper.checkFavourites(userID, listingID, db)
      .then(data => {
        console.log("Line 76",data);
        if (data.rows.length > 0) {
          res.end('Listing Already Added To Favourites');
        } else {    const queryString = `INSERT INTO favourites
        (user_id, listing_id)
        values ($1, $2) RETURNING *;`
        db.query(queryString, [userID, listingID])
        .then((data) => {
          const listings = data.rows
          //res.json({ listings })
          res.redirect("/account")
        })}
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });



  })

  router.post("/delete/:id", (req, res) => {
    const listingID = Number(Object.values(req.params))
    const userID = req.session.userId.id
    const queryString = `DELETE FROM favourites
    WHERE user_id = $1
    AND listing_id = $2;`
    db.query(queryString, [userID, listingID])
    .then((data) => {
      const listings = data.rows
      //res.json({ listings })
      res.redirect("/account")
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
  })
  return router
}

