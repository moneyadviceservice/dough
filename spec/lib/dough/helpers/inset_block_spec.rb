require 'spec_helper'

module Dough
  module Helpers
    class TestInsetBlockController < AbstractController::Base
      include AbstractController::Helpers
      include AbstractController::Rendering
      include ActionView::Rendering

      helper Dough::Helpers

      def index
        render inline: "<%= inset_block 'hello' %>"
      end

      private

      def lookup_context
        ActionView::LookupContext.new(ActionController::Base.view_paths)
      end
    end

    describe InsetBlock do
      it 'renders text' do
        controller = TestInsetBlockController.new
        controller.process(:index)
        expect(controller.response_body).to include('hello')
      end
    end
  end
end
