require 'spec_helper'

module Dough
  module Helpers
    describe InsetBlock do
      let(:context){ ActionView::LookupContext.new(ActionController::Base.view_paths) }
      let(:renderer){ Renderer.new(context) }

      subject{ described_class.new(renderer: renderer, text: 'hello') }

      it 'renders text' do
        expect(subject.render).to include('hello')
      end
    end
  end
end
