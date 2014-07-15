require 'spec_helper'

module Dough
  module Helpers
    describe InsetBlock do
      subject{ described_class.new(text: 'hello') }

      it 'renders text' do
        expect(subject.render).to include('hello')
      end
    end
  end
end
