(function (factory) {
  // Only works in window.
  var root = self;

  root.Quiz = factory(root, (root.jQuery || root.$));
})(function (root, $) {
  function Quiz(options) {
    this.options = options || {};
    
    $.extend({ type: 'addition' }, this.options);
    
    this._skip = 0;
    this._correct = 0;
    this._incorrect = 0;

    this.initialize();
  }

  $.extend(Quiz.prototype, {
    initialize: function () {
      this.handlers = {
        'form submit': 'doNothing',
        '.challenge click': 'challenge',
        '.skip click': 'skip'
      };

      this.registerHandler();
      this.generateQuiz();
    },
    registerHandler: function () {
      var self = this;
      $.each(this.handlers, function(k, v) {
        var split = k.split(" ");
        var el = split[0];
        var trigger = split[1];

        $(document).delegate(el, trigger, self[v].bind(self));
      });
    },
    generateQuiz: function () {
      this.x = this.getNumber();
      this.y = this.getNumber();
      

      if (this.options.type === 'addition') {
        this.z = this.x + this.y;
      } else if (this.options.type === 'subtraction') {
        var numbers = [this.x, this.y];

        numbers.sort(function (a, b) {
          return b - a;
        });
        this.x = numbers[0];
        this.y = numbers[1];
        this.z = this.x - this.y;
      } else {
        this.z = this.x * this.y;        
      }
      
      this.render();
    },
    getNumber: function () {
      if (this.options.type === 'addition' || this.options.type === 'subtraction') {
        return Math.floor(Math.random() * 100);
      } else {
        return Math.floor(Math.random() * 9) + 1;
      }
    },
    render: function () {
      $('.x').text(this.x);
      $('.y').text(this.y);
      $('.correct_count').text(this._correct);
      $('.incorrect_count').text(this._incorrect);
      $('.skip_count').text(this._skip);
      $('.answer').val('');
      $('.answer').focus();
    },
    challenge: function (e) {
      var answer = $('.answer').val();

      if (answer === '') {
        return;
      }

      var z = parseInt(answer, 10);

      $('.result_pannel').removeClass('bg-success bg-danger');
      $('.answer').focus();
      
      if (this.z === z) {
        this._correct = this._correct + 1;
        this.showResult(true);
        return;
      }

      this._incorrect = this._incorrect + 1;
      this.showResult(false);
      return;
    },
    showResult: function (correct) {
      var background = correct ? 'bg-success' : 'bg-danger';
      var delay = correct ? 400 : 1500;
      if (correct) {
        var text = '딩동댕';
      } else {
        var text = '땡! 정답은 ' + this.z;
      }

      $('.result').text(text);
      $('.result_pannel')
        .addClass(background)
        .fadeIn()
        .delay(delay)
        .fadeOut(400, this.generateQuiz.bind(this));
    },
    skip: function (e) {
      e.preventDefault();
      this._skip = this._skip + 1;
      this.generateQuiz();
    },
    doNothing: function (e) {
      if (e) {
        e.preventDefault();  
      }
    }
  });

  return Quiz;
});