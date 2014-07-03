require 'spec_helper'
class TestHelper < ActionView::Base; end

module Dough
  module Forms
    module Builders
      describe Basic do


        let(:resource)    { User.new }
        let(:helper)      { TestHelper.new }
        let(:builder)     { Dough::Forms::Builders::Basic.new(:user, resource, helper, {}, nil) }
        let(:normal_input) { builder.text_field :name }

        context 'inputs' do
          it "should build normal inputs" do
            expect(normal_input).to include '<div class="form__item">'
            expect(normal_input).to include '<label class="form__label-heading" for="user_name">Name</label>'
            expect(normal_input).to include '<input id="user_name" name="user[name]" size="30" type="text" />'

          end

        end

      end
    end
  end
end
