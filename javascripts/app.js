Shooter = Backbone.Model.extend({

})

ShooterView = Backbone.View.extend({

    initialize: function () {
        var self = this;
        this.render();
        this.detectCollision(self);
    },

    goLeft: function () {
        this.$el.animate({
            "left":"-=100px"
        }, 100)
    },

    goRight: function () {
        this.$el.animate({
            "left":"+=100px"
        }, 100)
    },

    detectCollision: function (shooter) {
        var self = this;
        var shooter_width = shooter.$el.width();
        var shooter_height = shooter.$el.height();
        self.collisionInterval = setInterval(function () {
            var shooter_left = shooter.$el.offset().left;
            var shooter_top = shooter.$el.offset().top;

                game.spaceinvaderscollection.views.forEach(function (space_invader) {

                    if (game.inProgress === false) {
                        return false;
                    }else{

                        var space_invader_left = space_invader.$el.offset().left
                        var space_invader_top = space_invader.$el.offset().top

                        if ((Math.abs(space_invader_left - shooter_left) <= shooter_width) && (space_invader_top >= shooter_top)) {
                            game.inProgress = false;
                            game.shooterview.gameOver();
                            return false;
                        }

                    }

            })
        }, 60)
    },

    gameOver: function () {
        console.log("running this function")
        game.shooterview.$el.hide("explode", { pieces: "36" }, 500, function () {
                            clearInterval(self.collisionInterval);
                            clearInterval(game.startGame);
                        })
    },

    className: "shooter_div",

    render: function () {
        var template = _.template($("#shooter_view").html());
        this.$el.html(template);
        $("#shooter_div_container").html(this.$el);
    }

})

SpaceInvader = Backbone.Model.extend({
    
})

SpaceInvaderView = Backbone.View.extend({

    initialize: function () {
        var self = this;
        this.render();
        game.spaceinvaderscollection.views.push(self);
    },

    className: "space_invader",

    render: function () {
        var template = _.template($("#space_invader_view").html())
        this.$el.html(template);
        $("#space_invaders_container").append(this.$el);
        var window_width = $(window).width();
        var randomLeft = Math.floor( Math.random() * window_width )
        this.$el.css({ "left": randomLeft})
        this.attack();
    },

    attack: function () {
        var self = this;
        var randomTime = Math.floor( Math.random() * 3000);
        var window_height = $(window).height();
        this.$el.animate({ "top": window_height + 100 }, randomTime, function () {
            index = game.spaceinvaderscollection.views.indexOf(self);
            game.spaceinvaderscollection.views.splice(index, 1);
            self.remove();
            self.model.destroy();
        });
    }

})

SpaceInvadersCollection = Backbone.Collection.extend({
    
    initialize: function () {
        this.on("add", console.log("added"))
        this.on("remove", this.destroy)
        this.views = [];
    }
})


var game = {

    initialize: function () {
        var self = this;
        self.inProgress = true;
        self.shooter = new Shooter();
        self.shooterview = new ShooterView();
        self.spaceinvaderscollection = new SpaceInvadersCollection();
        self.shooterMoveListen();

        self.startGame = setInterval(function () {
                            for (var i = 1; i <= 3; i++) {
                                var spaceinvader = new SpaceInvader();
                                var spaceinvaderview = new SpaceInvaderView({model: spaceinvader})
                                self.spaceinvaderscollection.add(spaceinvader); 
                            }
                        }, 1000)
        
        
    },

    shooterMoveListen: function () {
         $(document).on("keyup", function (e) {
            if (e.keyCode === 37) {
                game.shooterview.goLeft();
            }else if (e.keyCode === 39) {
                game.shooterview.goRight();
            }
        })
    }

}


$(function () {
    var window_width = window.innerWidth;
    $(".shooter_div").css({"margin-left": (window_width / 2)+"px"})
    game.initialize();
})