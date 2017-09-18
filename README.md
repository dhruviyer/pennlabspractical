# Disclaimer
This project used a MySQL server running locally on my machine with the db pennlabsinterview, so it won't work unless you also create a MySQL db under the same name on your machine, but this oculd easily be ported to the cloud using Google Cloud SQL (which I have experience in) or AWS. Also, on the front-end, I wasn't able to get list visualization done or get the delete commands in the front-end since they removed that ability from forms in HTML5

# Penn Labs: Backend Technical Project
Let's build an API server for Trello! If you're not familiar with Trello, it's not a problem. Trello is a task-management tool
that has 3 major functional components: Boards, Lists, and Cards. Each Board can contain many lists, which in turn can contain many cards. 
Each card generally represents an individual task that users can manage. Each list is a group of related tasks. We encourage you to play 
around with the tool [here](http://www.trello.com). A Board is a something that you might use to organize all of your tasks for one facet of your life. For example, we might have a board for School. In the School board, you might have a list for each class that you are taking. Within each list, you might have cards that represent homework assignments, tests, or projects. 

As a general tip, make sure to comment your code. Feel free to use credible third party libraries or packages. As a bonus, feel free to add your own spicy features, as long as they don't disturb the core functionality of the API server.

As a final note, it's not the end of the world if you don't finish this assignment! We are looking for quality code and people who are enthusiastic about programming. 😀

Let's begin! There are two parts to this assignment. 

## Part 1: API Server
First, take a look at the structure for the data we'd like you to assume. You may assume that your entire application deals with one board. Thus, you only need to deal with lists and cards.

### Structure of data
- Card
  - title: `String`
  - description: `String`
  - listId: `Number`
  - id: `Number`
- List
  - title: `String`
  - order: `Number`
  - id: `Number`

Build an API server that has the following routes. 
You must store data necessary for this API server in a database. You are free to use any database that you prefer.
Responses to requests to your API server should be in JSON format and at minimum contain a status code.

- *Adding a card*: Should add a card to the database with the given title and description. The card should be associated with the list with the provided listId.
<table>
  <tbody>
    <tr>
      <td>URL</td>
      <td><code>/card</code></td>
    </tr>
    <tr>
      <td>HTTP Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td>Parameters</td>
      <td>
        Post Form Parameters:
        <ul>
          <li><code>listId</code>: the ID of the list</li>
          <li><code>title</code>: the title of the list</li>
          <li><code>description</code>: the list description</li>
        </ul>
      </td>
    </tr>
  </tbody>
<table>

- *Adding a list*: Should add a list to the database with the given title. The newly added list's order should be at the end.

<table>
  <tbody>
    <tr>
      <td>URL</td>
      <td><code>/list</code></td>
    </tr>
    <tr>
      <td>HTTP Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td>Parameters</td>
      <td>
        Post Form Parameters:
        <ul>
          <li><code>title</code>: the title of the list</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

- *Changing the order of a list*: Should update the list with the provided listId. Should update only the fields provided in the querystring.

<table>
  <tbody>
    <tr>
      <td>URL</td>
      <td><code>/editlist/:listId</code></td>
    </tr>
    <tr>
      <td>HTTP Method</td>
      <td>POST</td>
    </tr>
    <tr>
      <td>Parameters</td>
      <td>
        URL Parameters:
        <ul>
          <li><code>listId</code>: the ID of the list to be updated</li>
        </ul>
        Post Form Parameters:
        <ul>
          <li><code>title</code>: the title of the list</li>
          <li><code>order</code>: the new place of the list (when changing order of the lists)<br>No two lists should have the same order.</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

- *Get card by ID*: Should get title, description, and listId from the card associated with the specified cardId.

<table>
  <tbody>
    <tr>
      <td>URL</td>
      <td><code>/card/:cardId</code></td>
    </tr>
    <tr>
      <td>HTTP Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td>Parameters</td>
      <td>
        URL Parameters:
        <ul>
          <li><code>cardId</code>: the ID of the desired card</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

- *Get list by ID*: Should get title and order from the list associated with the specified listId.

<table>
  <tbody>
    <tr>
      <td>URL</td>
      <td><code>/list/:listId</code></td>
    </tr>
    <tr>
      <td>HTTP Method</td>
      <td>GET</td>
    </tr>
    <tr>
      <td>Parameters</td>
      <td>
        URL Parameters:
        <ul>
          <li><code>listId</code>: the ID of the desired list</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

- *Delete card by ID*: Should delete the list associated with the specified listId.

<table>
  <tbody>
    <tr>
      <td>URL</td>
      <td><code>/card/:cardId</code></td>
    </tr>
    <tr>
      <td>HTTP Method</td>
      <td>DELETE</td>
    </tr>
    <tr>
      <td>Parameters</td>
      <td>
        URL Parameters:
        <ul>
          <li><code>cardId</code>: the ID of the desired card</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

- *Delete list by ID*: Should delete the list associated with the specified listId. Should also delete the cards associated with the list.

<table>
  <tbody>
    <tr>
      <td>URL</td>
      <td><code>/list/:listId</code></td>
    </tr>
    <tr>
      <td>HTTP Method</td>
      <td>DELETE</td>
    </tr>
    <tr>
      <td>Parameters</td>
      <td>
        URL Parameters:
        <ul>
          <li><code>listId</code>: the ID of the desired list</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<hr>

To clear things up a bit, consider the following example:
- Our data in the backend might look like this:

  Lists
  <table>
    <tr>
      <th>
        Id
      </th>
      <th>
        Title
      </th>
      <th>
        Order
      </th>
    </tr>
    <tr>
      <td>
        1234
      </td>
      <td>
        "Grocery List"
      </td>
      <td>
        1
      </td>
    </tr>
    <tr>
      <td>
        1235
      </td>
      <td>
        "School Supplies"
      </td>
      <td>
        2
      </td>
    </tr>
  </table>

  Cards
  <table>
    <tr>
      <th>
        Id
      </th>
      <th>
        Title
      </th>
      <th>
        Description
      </th>
      <th>
        ListId
      </th>
    </tr>
    <tr>
      <td>
        5332
      </td>
      <td>
        "Eggs"
      </td>
      <td>
        "Need to buy a lot of eggs"
      </td>
      <td>
        1234
      </td>
    </tr>
  </table>

- User sends GET `/list/1234`
- Assuming the request is well-formed, the user receives the following response:
  ```
  {
    status: 200,
    title: "Grocery List",
    order: 1
  }
  ```
- User sends POST `/card` with params: {listId: 1234, title: "Milk", description: "Go Buy Milk"}
- Cards data now looks like:

  Cards
  <table>
    <tr>
      <th>
        Id
      </th>
      <th>
        Title
      </th>
      <th>
        Description
      </th>
      <th>
        ListId
      </th>
    </tr>
    <tr>
      <td>
        5332
      </td>
      <td>
        "Eggs"
      </td>
      <td>
        "Need to buy a lot of eggs"
      </td>
      <td>
        1234
      </td>
    </tr>
    <tr>
      <td>
        5333
      </td>
      <td>
        "Milk"
      </td>
      <td>
        "Go Buy Milk"
      </td>
      <td>
        1234
      </td>
    </tr>
  </table>

## Part 2: Data form
Build an HTML form that enables form users to add, edit, and delete cards and add, edit, and delete lists. The form should also somehow display visually the results of the user input. For the example given above, the form would show the two lists (in the order specified) and the two cards under the first list. You can use this form to test your API server. We are not concerned with the aesthetics of the form. We just care that it is functional.

## Submitting
1. Fork this project and clone it to your local machine.
2. Push all of your commits to the fork.
3. If you have any questions, confusions, or comments at all, feel SUPER FREE to email us at `niharp@seas.upenn.edu`, `rohanmen@seas.upenn.edu`, or `branlin@seas.upenn.edu`. We're here to help 😁. We'll help you through it - don't sweat!
