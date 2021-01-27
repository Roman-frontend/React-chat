const graphql = require('graphql');

//GraphQLObjectType - дозволяє повністю описати схему що зберігатиметься в базі, вона приймає ім'я(звичайний рядок - строка), field(якому присвоюється функція що в свою чергу поверне об'єкт даних(в якому ми описуємо поля даних тут id, name, genre і їм задаємо типи які експортуємо з graphql (в даному випадку ми з експортували GraphQLString - тип строки )) )
//GraphQLID - приймає як числові значення так і строкові
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  //GraphQLInt - цілочислове число (без коми) для даних з типом числа
  GraphQLInt,
  //Використовується для виведення списку елементів
  GraphQLList,
  // Задача GraphQLNonNull - маркувати обов'язкові поля
  GraphQLNonNull,
} = graphql;

const Movies = require('../Models2/movie');
const Directors = require('../Models2/director');
const User = require('../models/User.js');

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    //Поле director - описано не як поле з даними а як зв'язок між колекціями
    director: {
      type: DirectorType,
      //resolve на основі отриманих аргументів повертає певні дані з колекції
      //resolve - встановлює зв'язок між двома колекціями
      //Щоб на devTools перевірити прихід даних в верхньому блоці вводжу - query($id: ID) {movie(id: $id) {id name director {name}}  - а в блоці QUERE VARIABLES - {"id": 3}
      resolve(parent, args) {
        //id беремо з parent(як я поняв це буде id з MovieType)
        return directors.find((director) => director.id === parent.id);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  //fields - ми обертаємо в функцію () => ({}) - щоб DirectorType - була доступна (наприклад MovieType) ще до того як буде об'явлена
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      //Всередину конструктора GraphQLList - передаю схему фільмів
      type: new GraphQLList(MovieType),
      //Щоб на devTools перевірити прихід даних в верхньому блоці вводжу - query($id: ID) {directore(id: $id) {id name movies {name}}  - а в блоці QUERE VARIABLES - {"id": 3}
      resolve(parent, args) {
        //З допомогою методу масивів filter - відсіюю всі фільми в залежності від автора і повертаю знайдений список елементів і це юуде зв'язок між колекціями
        return movies.filter((movie) => movie.directorId === parent.id);
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  //Оприділяємо тип запиту як - Mutation
  name: 'Mutation',
  fields: {
    //Додою мутацію - addDirector - яка буде додавати режисера
    addDirector: {
      // type: DirectorType - дозволяє як і раніше працювати з типом режисера
      type: DirectorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      //в resolve - описуємо весь функціонал
      //для тесту mutation($name: String, $age: String) {addDirector(name: $name, age: $age) {name age}} - а в блоці QUERE VARIABLES - {"name": "Fedir", "age": "40"}
      resolve(parent, args) {
        //З допомогою mongoose схеми оприділяємо нову сутність такуж яка задана в моделі
        const director = new Directors({
          name: args.name,
          age: args.age,
        });
        //director.save() - дозволяє зберегти в базі новий екземпляр
        //return - використовуючи return ми отримаємо відповідь в devTools
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
        });
        return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //з допомогою mongoose метода .findByIdAndRemove() - шукаємо модель з id - args.id  - і видаляємо його
        return Directors.findByIdAndRemove(args.id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findByIdAndRemove(args.id);
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return Directors.findByIdAndUpdate(
          //args.id - параметр по якому буде шукатися елемент
          args.id,
          //Сюди присвоюємо обновлений об'єкт що отримаємо з  args
          { $set: { name: args.name, age: args.age } },
          //Опція що дозволяє побачити в відповіді обновлені дані
          { new: true }
        );
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        //без new GraphQLNonNull() - використання updateMovie обновить всі дані елемента і де буде не задано інформацію буде поставлено null
        // Задача GraphQLNonNull - маркувати обов'язкові поля
        //Обгортаючи тип даних в - new GraphQLNonNull() - ми маркуємо ці поля як обов'язкові.
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
      },
      //Запустити - mutation($id: ID, $name: String!, $genre: String!) {updateMovie(id: $id, name: $name, genre: $genre) {id name genre}} - а в блоці QUERE VARIABLES - {"id": "601095f0010b3b1b94cca98f", "name": "Sanya", "genre": "Some"}
      resolve(parent, args) {
        return Movies.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              genre: args.genre,
              directorId: args.directorId,
            },
          },
          { new: true }
        );
      },
    },
  },
});

// З допомогою GraphQLObjectType - описуємо новий об'єкт Query - де я можу описати всі під-запити - тут це під-запит movie(тобто запит одного фільма), в самому під-запиті описуємо те що він має містити(в нашому випадку запит movie носить тип MovieType), args - описує які аргументи приймає запит, resolve - приймає аргументи: parent, args. Всередині цього метода ми описуємо логіку того які дані повинні повертатись - тобто певні алгоритви повернення певних даних
const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      //Щоб на devTools перевірити прихід даних в верхньому блоці вводжу - query($id: ID) {movie(id: $id) {id name genre}  - а в блоці QUERE VARIABLES - {"id": 3}
      resolve(parent, args) {
        // Використовуємо не суворе зрівняння - == щоб як тип даних підходили строка і число.
        return movies.find((movie) => movie.id == args.id);
      },
    },
    director: {
      //В якості type вказуємо - DirectorType - оскільки це новий тип колекції
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.find({});
        //return directors.find((director) => director.id === args.id);
      },
    },
    //Повертає повний список фільмів
    movies: {
      type: new GraphQLList(MovieType),
      //В запиті приймаємо аргумент name
      args: { name: { type: GraphQLString } },
      resolve(parent, { name }) {
        //В .find() -  передаю ім'я і шукаю відповідне значення
        //$regex - фактично це аналог регулярного виразу яке тут приймає передане йому ім'я
        //$options - параметри опцій того як повинен відбуватися пошук а як значення "і" - означає що пошуковий запит буде не чуттєвий до регістру
        return User.find({ name: { $regex: name, $options: 'i' } });
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return directors;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
