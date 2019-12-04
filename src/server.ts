import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose"
import cookieParser from 'cookie-parser';  
import Controller from './interfaces/controller.interface';
import AuthenticationController from './authentication/authentication.controller';
import UserController from './user/user.controller'
import PostController from './post/post.controller'



class Application {
    public app: express.Application;
    public port: number;

    constructor() {
        this.app = express();
        this.port = +process.env.serverPort || 3000;
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.initializeMiddlewares();
        // this.initializeControllers(new AuthenticationController());
        this.initCors();
    }
    // Starts the server on the port specified in the environment or on port 3000 if none specified.
    public start(): void {
        // this.buildRoutes();
        this.app.listen(this.port, () => console.log("Server listening on port " + this.port + "!"));
        this.initializeControllers([new PostController(),
            new AuthenticationController(),
            new UserController() ]);
        this.Connection();
    }

    // sets up to allow cross-origin support from any host.  You can change the options to limit who can access the api.
    // This is not a good security measure as it can easily be bypassed,
    // but should be setup correctly anyway.  Without this, angular would not be able to access the api it it is on
    // another server.
    public initCors(): void {
        this.app.use(function(req: express.Request, res: express.Response, next: any) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
          this.app.use('/', controller.router);
        });
      }
    

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }


    // // setup routes for the express server
    // public buildRoutes(): void {
    //     this.app.use("/api", new ApiRouter().getRouter());
    // }

    /**
     * setup mongodb and connect
     */
    public Connection() {
        const uri = "mongodb+srv://xluox:KRISTENiloveu1314@gmaebar-ozmdh.mongodb.net/test?retryWrites=true&w=majority";
        mongoose.Promise = global.Promise;
        mongoose.connect(uri, {useCreateIndex : true, useNewUrlParser: true, useUnifiedTopology : true}).catch((err) =>console.log(err) 
        );
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log("Mongodb Connected!!");
        });

        // var memberSchema = new mongoose.Schema({
        //     name: String,
        //     type: String
        // });

        // memberSchema.methods.speak = function () {
        //     var greeting = this.name
        //       ? "Meow name is " + this.name
        //       : "I don't have a name";
        //     console.log(greeting);
        //   }

        // var Member = mongoose.model('Member', memberSchema);


        // var fluffy = new Member({ name: 'fluffy' });
        // // fluffy.speak(); // "Meow name is fluffy"

        // fluffy.save(function (err, fluffy) {
        //     if (err) return console.error(err);
        //     // fluffy.speak();
        // });

        // Member.find(function (err, members) {
        //     if (err) return console.error(err);
        //     console.log(members);
        // })

    }


}
new Application().start();
