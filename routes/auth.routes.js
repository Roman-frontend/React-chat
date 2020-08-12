const {Router} = require('express')
/**Дозволяє захешувати і порівнювати пароль користувача щоб його не зламали */
const bcrypt = require('bcryptjs')
/**Дозволяє перевіряти прийшовші дані на коректність */
const {check, validationResult} = require('express-validator')
/**Дозволяє створити token для авторизації користувача */
const config = require('config')
const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
const router = Router()

router.post(
  '/register', 
  /**масив midleware(проміжних функцій) для перевірки коректності прийшовших даних*/
  [
  	/**.isEmail() - Перевіряє на коректність email */
  	check('email', 'Некоректний email').isEmail(),
  	/**.isLength({min: 6}) - перевіряє чи довжина паролю не менше 6 символів */
  	check('password', 'Мінімальна довжина паролю 6 символів').isLength({min: 6}),
    check('name', 'Мінімальна довжина имени 2 символів').isLength({min: 2})
  ],
  async (req, res) => {
  try {
  	/**validationResult() - перевіряє через проміжні функції check() коректність req(даних що прийшли) */
  	const errors = validationResult(req)

  	/**Якщо validationResult() - спрацював то метод isEmpty() - не буде порожнім  */
  	if (!errors.isEmpty()) {
  	  /**@return error if validationResult() = has errors */
  	  return res.status(400).json({
  	  	errors: errors.array(),
  	  	message: 'Некоректні дані при реєстрації'
  	  })
  	}

    const {name, email, password} = req.body	

    const candidate = await User.findOne({email})  //оскільки ключ і значення email співпадають то упускаю значення

    if(candidate) {
      res.status(400).json({message: "Такой пользователь уже существует"})
    }

    /**якщо email не існує то .hash() хешуємо пароль, 12 - дозволяє ще білльше зашифрувати пароль */
    const hashPassword = await bcrypt.hash(password, 12)
    /**Створюю нового користувача з захешованим паролем */
    const user = new User({name, email, password : hashPassword})
    /**чекаємо реєстрації цієї людини */
    await user.save()

    const finedUser = await User.findOne({email})

    const token = jwt.sign(
      {userId: user.id},
      config.get('jwtSecret'),
      { expiresIn: '1h'}
    )

    res.status(201).json({name: user.name, token, userId: user.id, message : 'Пользователь создан'})
  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так "})
  }
})

router.post(
  '/login', 
  [
  	/**.normalizeEmail() - перевіряє на коректність  */
  	check('email', 'Введите коректний email').normalizeEmail().isEmail(),
  	/**.exists() - Пароль повинен існувати */
  	check('password', 'Мінімальна довжина паролю 6 символів').exists().isLength({min: 6})
  ],
  async (req, res) => {
  try {
  	const errors = validationResult(req)

  	if (!errors.isEmpty()) {
  	  return res.status(400).json({
  	  	errors: errors.array(),
  	  	message: 'Некоректні дані при вході в систему'
  	  })
  	}

    const {email, password} = req.body	
    console.log(email)
    const user = await User.findOne({email})  //оскільки ключ і значення email співпадають то упускаю значення
    console.log(user)

    if(!user) {
      res.status(400).json("Такой пользователь не найден")
    }

    /**
    *bcrypt.compare() - порівнює паролі де перший аргумент пароль що прийшов 
    *другий - пароль з бази даних. Цей метод поверне true якщо паролі не співпадають
    */
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний пароль, спробуйте знову'})
    }

    /**Робимо авторизацію користувача */
    const token = jwt.sign(
      /**вказуємо дані що будуть зашифровані в jwt token */
      {userId: user.id},
      /**секретний ключ з папки config*/
      config.get('jwtSecret'),
      /**expiresIn: - вказує через скільки наш jwt token закінчить своє існування */
      { expiresIn: '1h'}
    )
    console.log(user.name, token, user.id)
    res.json({name: user.name, token, userId: user.id})

  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так "})
  }
})


module.exports = router