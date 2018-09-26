package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"

	"github.com/gin-contrib/cors" // Why do we need this package?
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite" // If you want to use mysql or any other db, replace this line
)

var db *gorm.DB // declaring the db globally
var err error

type Person struct {
	ID        uint   `json:"id"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	City      string `json:"city"`
}

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Type     uint   `json:"type"`
}

type Quiz struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Genre string `json:"genre"`
}

type Question struct {
	ID   uint
	Qid  uint   `gorm:"type:integer REFERENCES quizzes(id) ON DELETE CASCADE ON UPDATE CASCADE"`
	Body string `gorm:"type:varchar(2000)"`
}

type Option struct {
	ID        uint
	Quid      uint   `gorm:"type:integer REFERENCES questions(id) ON DELETE CASCADE ON UPDATE CASCADE"`
	Body      string `gorm:"type:varchar(2000)"`
	IsCorrect bool
}

type Record struct {
	ID    uint
	Qid   uint `gorm:"type:integer REFERENCES quizzes(id)"`
	Uid   uint `gorm:"type:integer REFERENCES users(id)"`
	Score uint
}

type QJoin struct {
	Qid      uint
	QuesBody string
	Op1      string
	Op2      string
	Op3      string
	Op4      string
	C1       bool
	C2       bool
	C3       bool
	C4       bool
}

type RJoin struct {
	Username string
	Qid      uint
	Score    uint
}

func main() {
	db, err = gorm.Open("sqlite3", "./gorm.db")
	db.Exec("PRAGMA foreign_keys = ON")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	// db.DropTableIfExists(&User{})
	db.AutoMigrate(&Person{}, &User{}, &Quiz{}, &Question{}, &Option{}, &Record{})

	r := gin.Default()

	r.GET("/users/", GetUsers)
	r.POST("/users", CreateUser)
	r.POST("/checkuser", CheckUser)
	r.DELETE("users/:id", DeleteUser)

	r.GET("/getquizzes", GetQuizzes)
	r.DELETE("/quiz/:id", DeleteQuiz)
	r.POST("/addquiz", CreateQuiz)
	r.GET("/quiz/:id", GetQuiz)

	r.POST("/addques", CreateQues)
	r.GET("/getques/:qid", GetQues)

	r.GET("/getoptions/:quid", GetOptions)
	r.POST("/addrec", AddRecord)
	r.GET("/gettaken/:username", GetTaken)

	// r.GET("/people/", GetPeople) // Creating routes for each functionality
	// r.GET("/people/:id", GetPerson)
	// r.POST("/people", CreatePerson)
	// r.PUT("/people/:id", UpdatePerson)
	// r.DELETE("/people/:id", DeletePerson)
	r.Use((cors.Default()))
	r.Run(":8080") // Run on port 8080
}

// func DeletePerson(c *gin.Context) {
// 	id := c.Params.ByName("id")
// 	var person Person
// 	d := db.Where("id = ?", id).Delete(&person)
// 	fmt.Println(d)
// 	c.Header("access-control-allow-origin", "*")
// 	c.JSON(200, gin.H{"id #" + id: "deleted"})
// }

// func UpdatePerson(c *gin.Context) {
// 	var person Person
// 	id := c.Params.ByName("id")
// 	if err := db.Where("id = ?", id).First(&person).Error; err != nil {
// 		c.AbortWithStatus(404)
// 		fmt.Println(err)
// 	}
// 	c.BindJSON(&person)
// 	db.Save(&person)
// 	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
// 	c.JSON(200, person)
// }

// func CreatePerson(c *gin.Context) {
// 	var person Person
// 	c.BindJSON(&person)
// 	db.Create(&person)
// 	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
// 	c.JSON(200, person)
// }

func CreateUser(c *gin.Context) {
	var user User
	c.BindJSON(&user)

	var temp User
	if err := db.Where("username = ?", user.Username).First(&temp).Error; err != nil {

		h := sha256.New()
		h.Write([]byte(user.Password))
		user.Password = hex.EncodeToString(h.Sum(nil))

		db.Create(&user)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, user)
	} else {
		c.Header("access-control-allow-origin", "*")
		c.JSON(350, "")
	}

}

func GetUsers(c *gin.Context) {
	var users []User
	if err := db.Find(&users).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, users)
	}
}

func CheckUser(c *gin.Context) {
	var user User
	c.BindJSON(&user)

	var temp User
	if err := db.Where("username = ?", user.Username).First(&temp).Error; err != nil {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(355, "")
		fmt.Println(err)
	} else {

		h := sha256.New()
		h.Write([]byte(user.Password))
		user.Password = hex.EncodeToString(h.Sum(nil))

		if user.Password == temp.Password {
			if temp.Type == 0 {
				c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
				c.JSON(200, "")
			} else {
				c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
				c.JSON(205, "")
			}
		} else {
			c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
			c.JSON(350, "")
		}
	}
}

func DeleteUser(c *gin.Context) {
	id := c.Params.ByName("id")
	var user User
	d := db.Where("id = ?", id).Delete(&user)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

func GetQuizzes(c *gin.Context) {
	var quizzes []Quiz
	if err := db.Find(&quizzes).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, quizzes)
	}
}

func DeleteQuiz(c *gin.Context) {
	id := c.Params.ByName("id")
	var quiz Quiz
	d := db.Where("id = ?", id).Delete(&quiz)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

func CreateQuiz(c *gin.Context) {
	var quiz Quiz
	c.BindJSON(&quiz)

	var temp Quiz
	if err := db.Where("name = ?", quiz.Name).First(&temp).Error; err != nil {

		db.Create(&quiz)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, quiz)
	} else {

		if temp.Genre == quiz.Genre {
			c.Header("access-control-allow-origin", "*")
			c.JSON(350, "")
		}
	}

}

func GetQuiz(c *gin.Context) {
	id := c.Params.ByName("id")
	var quiz Quiz
	if err := db.Where("id = ?", id).First(&quiz).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, quiz)
	}
}

func CreateQues(c *gin.Context) {
	var inp QJoin
	c.BindJSON(&inp)

	fmt.Println(inp)

	var temp Question
	insques := Question{Body: inp.QuesBody, Qid: inp.Qid}
	if err := db.Model(&Question{}).Where("body = ?", insques.Body).First(&temp).Error; err != nil {

		db.Create(&insques)
		insopts := Option{Quid: insques.ID, Body: inp.Op1, IsCorrect: inp.C1}
		db.Create(&insopts)
		insopts = Option{Quid: insques.ID, Body: inp.Op2, IsCorrect: inp.C2}
		db.Create(&insopts)
		insopts = Option{Quid: insques.ID, Body: inp.Op3, IsCorrect: inp.C3}
		db.Create(&insopts)
		insopts = Option{Quid: insques.ID, Body: inp.Op4, IsCorrect: inp.C4}
		db.Create(&insopts)

		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, &inp)
	} else {

		c.Header("access-control-allow-origin", "*")
		c.JSON(350, "")
	}

}

func GetQues(c *gin.Context) {
	qid := c.Params.ByName("qid")
	var quess []Question

	if err = db.Joins("JOIN quizzes ON quizzes.id = questions.qid").Where("qid = ?", qid).Find(&quess).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, quess)
	}
}

func GetOptions(c *gin.Context) {
	quid := c.Params.ByName("quid")
	var options []Option

	if err = db.Joins("JOIN questions ON questions.id = options.quid").Where("quid = ?", quid).Find(&options).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, options)
	}
}

func AddRecord(c *gin.Context) {
	var inp RJoin
	c.BindJSON(&inp)

	var user User
	// fmt.Println(inp)
	db.Where("username = ?", inp.Username).First(&user)

	var tmp Record
	if err = db.Joins("JOIN users ON users.id = records.uid").Joins("JOIN quizzes ON quizzes.id = records.qid").Where("records.uid = ? AND records.qid = ?", user.ID, inp.Qid).First(&tmp).Error; err == nil {
		c.Header("access-control-allow-origin", "*")
		c.JSON(350, "")
	} else {
		record := Record{Qid: inp.Qid, Uid: user.ID, Score: inp.Score}
		// fmt.Println(record)
		db.Create(&record)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, &record)
	}
}

func GetTaken(c *gin.Context) {
	username := c.Params.ByName("username")

	type Taken struct {
		Name  string
		Score uint
	}

	var taken []Taken
	// var rec []Record
	err := db.Raw("SELECT quizzes.name, records.score FROM quizzes, records, users WHERE users.id = records.uid AND records.qid = quizzes.id AND users.username = ?", username).Scan(&taken).Error

	// err = db.Joins("JOIN users ON users.id = records.uid").Joins("JOIN quizzes ON quizzes.id = records.quid").Where("users.username = ?", username).Find(&rec);

	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		// fmt.Println(rec)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, taken)
	}
}

// func GetTaken(c *gin.Context) {
// 	var taken []Record
// }

// func GetPerson(c *gin.Context) {
// 	id := c.Params.ByName("id")
// 	var person Person
// 	if err := db.Where("id = ?", id).First(&person).Error; err != nil {
// 		c.AbortWithStatus(404)
// 		fmt.Println(err)
// 	} else {
// 		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
// 		c.JSON(200, person)
// 	}
// }

// func GetPeople(c *gin.Context) {
// 	var people []Person
// 	if err := db.Find(&people).Error; err != nil {
// 		c.AbortWithStatus(404)
// 		fmt.Println(err)
// 	} else {
// 		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
// 		c.JSON(200, people)
// 	}
// }
