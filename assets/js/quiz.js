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

      if (this.options.type === 'alphabet') {
        this.dictionary = this._getDictionary();
      }

      this._registerHandler();
      this._generateQuiz();
    },
    _registerHandler: function () {
      var self = this;
      $.each(this.handlers, function(k, v) {
        var split = k.split(" ");
        var el = split[0];
        var trigger = split[1];

        $(document).delegate(el, trigger, self[v].bind(self));
      });
    },
    _generateQuiz: function () {
      if (this.options.type === 'alphabet') {
        this.x = this.dictionary[0].z;
        this.y = '';
      } else {
        this.x = this._getNumber();
        this.y = this._getNumber();
      }
      
      if (this.options.type === 'alphabet') {
        this.z = this.dictionary[0].y;
      } else if (this.options.type === 'addition') {
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
    _getNumber: function () {
      if (this.options.type === 'addition' || this.options.type === 'subtraction') {
        return Math.floor(Math.random() * 100);
      } else {
        return Math.floor(Math.random() * 9) + 1;
      }
    },
    _getDictionary: function () {
      var dictionary = [
        { x: 'A', y: 'a', z: '에이' },
        { x: 'B', y: 'b', z: '비' }, 
        { x: 'C', y: 'c', z: '씨' }, 
        { x: 'D', y: 'd', z: '디' }, 
        { x: 'E', y: 'e', z: '이' }, 
        { x: 'F', y: 'f', z: '에프' }, 
        { x: 'G', y: 'g', z: '쥐' }, 
        { x: 'H', y: 'h', z: '에이취' }, 
        { x: 'I', y: 'i', z: '아이' }, 
        { x: 'J', y: 'j', z: '제이' }, 
        { x: 'K', y: 'k', z: '케이' }, 
        { x: 'L', y: 'l', z: '엘' }, 
        { x: 'M', y: 'm', z: '엠' }, 
        { x: 'N', y: 'n', z: '엔' },
        { x: 'O', y: 'o', z: '오' }, 
        { x: 'P', y: 'p', z: '피' }, 
        { x: 'Q', y: 'q', z: '큐' }, 
        { x: 'R', y: 'r', z: '알' }, 
        { x: 'S', y: 's', z: '에스' }, 
        { x: 'T', y: 't', z: '티' }, 
        { x: 'U', y: 'u', z: '유' }, 
        { x: 'V', y: 'v', z: '브이' }, 
        { x: 'W', y: 'w', z: '더블유' }, 
        { x: 'X', y: 'x', z: '엑스' }, 
        { x: 'Y', y: 'y', z: '와이' }, 
        { x: 'Z', y: 'z', z: '지' }, 
      ];

      return dictionary;
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

      if (this.options.type === 'alphabet') {
        var z = answer;
        
        this.dictionary.shift();
        
        console.log(this.dictionary.length);
        if (!this.dictionary.length) {
          this.dictionary = this._getDictionary();
        }
      } else {
        var z = parseInt(answer, 10);
      }

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
        .fadeOut(400, this._generateQuiz.bind(this));
    },
    skip: function (e) {
      e.preventDefault();
      this._skip = this._skip + 1;
      this._generateQuiz();
    },
    doNothing: function (e) {
      if (e) {
        e.preventDefault();  
      }
    }
  });

  return Quiz;
});