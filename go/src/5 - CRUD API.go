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

func main() {
	db, err = gorm.Open("sqlite3", "./gorm.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	// db.DropTableIfExists(&User{})
	db.AutoMigrate(&Person{}, &User{})
	r := gin.Default()

	r.GET("/users/", GetUsers)
	r.POST("/users", CreateUser)
	r.POST("/checkuser", GetUser)
	r.DELETE("users/:id", DeleteUser)

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

func GetUser(c *gin.Context) {
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
	// fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

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
