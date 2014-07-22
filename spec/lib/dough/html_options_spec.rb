require 'spec_helper'

module Dough
  describe HtmlOptions do
    describe 'to_s' do
      subject{ described_class.new(id: 'a', classes: 'b c') }

      it 'returns key value pairs in a string' do
        expect(subject.to_s).to eql('id="a" class="b c"')
      end
    end
  end
end
