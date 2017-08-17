RSpec.describe 'dough/forms/builder/_errors_for.html.erb', type: :view do
  describe 'render error collection' do
    before { pending }

    inline_error = <<-ERROR
      <div class="js-inline-error">
        <p class="validation-summary__error" id="error-new_custom_model-1">
          1.Name can't be blank
        </p>
      </div>
    ERROR

    it 'renders inline error' do
      expect(rendered).to include inline_error
    end
  end
end
