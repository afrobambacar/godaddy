(function (factory) {
  var root = self;

  root.Quiz = factory(root, (root.jQuery || root.$));

})(function (root, $) {
  function _Quiz(options) {
    this.options = options || {};
    
    $.extend({ type: 'addition' }, this.options);
    
    this._skip = 0;
    this._correct = 0;
    this._incorrect = 0;

    this.initialize();
  }

  $.extend(_Quiz.prototype, {
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
      
      if (this.options.type !== 'addition') {
        this.z = this.x * this.y;  
      } else {
        this.z = this.x + this.y;
      }
      
      this.render();
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
    getNumber: function () {
      if (this.options.type !== 'addition') {
        return Math.floor(Math.random() * 9) + 1;
      } else {
        return Math.floor(Math.random() * 100);
      }
    },
    challenge: function (e) {
      var answer = $('.answer').val();

      if (answer === '') {
        return;
      }

      var z = parseInt(answer, 10);

      $('.result_pannel').removeClass('bg-success bg-danger');
      if (this.z === z) {
        $('.result').text('딩동댕');
        $('.result_pannel').addClass('bg-success').fadeIn().delay(700).fadeOut();
        this._correct = this._correct + 1;
        this.generateQuiz();
        return;
      }
      $('.result').text('땡')
      $('.result_pannel').addClass('bg-danger').fadeIn().delay(700).fadeOut();
      this._incorrect = this._incorrect + 1;
      this.generateQuiz();
      return;
    },
    skip: function (e) {
      e.preventDefault();
      this._skip = this._skip + 1;
      this.generateQuiz();
    },
    doNothing: function (e) {
      e.preventDefault();
    }
  });

  return _Quiz;
});