## Maxwell Jeronimo
## Link: https://a2-maxwelljeronimo-a25-2.onrender.com

## Vinyl Collection System
This project is a Two-Tier Node.js and a HTML/JS web app that keeps track of a collection of vinyls.  A user can add
vinyls that they currently own, or ones that they are looking to get, as well as view their current collection
of both owned or wanted vinyls, as well as see purchase links if they do not own them.  I used Flexbot positioning
and card-styled forms, tables, and textboxes, utilized by a css file.

In order to use the application, you would navigate throught the two links in the nav bar, one being the Add Vinyl tab,
and the other being the View Collection tab.  All data is stored dynamically through the data.json file.


## Technical Achievements
- **Tech Achievement 1**: I implemented all inline editing any of the result table fields, without having to refresh 
                          the page.

- **Tech Achievement 2**: I utilized server generated derived fields, one being slug, which is a unique identifier which
                          takes the combonation of both the vinyl name and artist's name, and the second field being dateAdded, which just logs
                          when the vinyl was inputted to the application.

- **Tech Achievement3**: I implemented dynamic form logic to the Add Vinyl form, where if you were to select the option:
                        Owned?, the purchase link field hides instantly, and reverts back when you unclick it as well.

### Design/Evaluation Achievements
- **Design Achievement 1**: I made the entire UI uniform, which keeps a very consistent and visually pleasing application.
  
- **Design Achievement 2**: The delete actions require two steps to verify that is the action you want to take, which
                            helps with any accidental data loss.

- **Design Achievement 3**: The navigation is fairly simple to follow, allowing for easy user interaction.
